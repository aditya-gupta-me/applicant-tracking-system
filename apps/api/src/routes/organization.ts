import express, { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { protectedRoute } from "../middleware/auth.middleware";
import { z } from "zod";
import slugify from "slugify";
import { createOrganizationSchema, inviteUserInOrganizationSchema } from '@repo/schema';
import { randomShortId } from "../utils/slugGenerator";
import generateRandomSecretKey from "../utils/keyGen";
import { sendEmail } from "../utils/emailService";

const organizationRouter: Router = express.Router();


organizationRouter.post('/create', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    // parse the zod's validation
    const body = z.safeParse(createOrganizationSchema, req.body);

    // handle zod validation error
    // catches errors
    if(!body.success){
        return res.status(422).json({
            error: {
                code: "VALIDATION_ERROR",
                message: "Please check the submitted organization details.",
                details: body.error.issues
            }
        });
    }

    const adminId = req.user?.id;
    if (!adminId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    

    let slug = slugify(body.data.name, {
        lower: true
    });

    // check for existing slug in org
    const existing = await prisma.organization.findUnique({
        where: {slug},
    })

    // if found
    // then append randomShortId
    if(existing){
        slug = `${slug}-${randomShortId()}`;
    }

    try {

        const organization = await prisma.$transaction(async (tx) => {

            // create the organization
            const org = await tx.organization.create({
                data: {
                    name: body.data.name,
                    slug: slug,
                    email: body.data.email,
                    website: body.data.website,
                    image: body.data.image,
                    establishedDate: body.data.establishedDate,
                    adminId: adminId
                }
            });

            // create organization member
            await tx.organizationMember.create({
                data: {
                    userId: adminId,
                    orgId: org.id,
                    role: 'ADMIN'
                }
            })
            

            return org;
        }) 

        return res.status(201).json({
            message: "Organization created successfully.",
            data: { organizationId: organization.id }
        });
    } catch(error) {
        console.error("Transaction failed & rolled back: ", error);
        return res.status(500).json({
            error: {
                code: "INTERNAL_SERVER_ERROR",
                message: "We could not create the organization. Please try again."
            }
        })
    }

})

organizationRouter.get('/user-exists-in-org', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const userId = req.user?.id;

    if(!userId) {
        return res.status(401).json({
            error: "Unauthorized"
        })
    }

    const userExists = await prisma.organizationMember.findFirst({
        where: {
            userId: userId,
        }
    })

    return res.status(200).json({
        exists: Boolean(userExists)
    })
})


organizationRouter.post('/create-invite', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const body = z.safeParse(inviteUserInOrganizationSchema, req.body);

    // zod validation
    // catch & return error
    if(!body.success) {
        return res.status(422).json({
            error: body.error
        })
    }

    // check user exists in db
    const userExists = await prisma.user.findFirst({
        where: {
            email: body.data.email
        }
    })

    if(!userExists) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    // check if user is not part of another organization
    const userExistsInOrganization = await prisma.organizationMember.findFirst({
        where: {
            userId: userExists.id
        }
    })

    // as one user/employee 
    // can only be part one organization
    if(userExistsInOrganization) {
        return res.status(409).json({
            message: 'User has already joined an organization.'
        })
    }

    // check for a valid
    // invite that already exists
    const existingPendingInvite = await prisma.organizationInvite.findFirst({
        where: {
            email: body.data.email,
            status: 'PENDING',
            expiresAt: {
                gt: new Date()
            }
        }
    })

    // invite already exists
    // no need to send another
    // until the previous expires
    if(existingPendingInvite){
        return res.status(200).json({
            message: 'Already invited in organization.'
        })
    }

    // remember: 14 for random bytes

    const randomInviteToken: string = generateRandomSecretKey(14);

    const orgId = await prisma.organizationMember.findFirst({
        where: {
            userId: req.user?.id
        }
    })

    if(!orgId) {
        return res.status(401).json({
            error: "Some error occurred, try again later."
        })
    }

    try {
        const generateInvite = await prisma.organizationInvite.create({
            data: {
                inviteToken: randomInviteToken,
                orgId: orgId?.orgId,
                email: body.data.email,
                role: body.data.role,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                status: "PENDING"
            }
        })

        const userInviteToken: string = `${process.env.WEB_URL}/invite/${generateInvite.inviteToken}`;
        const emailSubject = `Here's your invite link to join Senior ATS`;
        const emailHtml = `<p>Hello,</p>\n<p>Your organization admin has invited you to join the organization.</p>\n<p>Click the link below to join your organization.</p>${userInviteToken}</br></hr><strong>Senior ATS</strong>`;

        const email = await sendEmail('onboarding@resend.dev', generateInvite.email, emailSubject, emailHtml);

        if(email.error){
            return res.status(503).json({
                message: 'Email service unavailable. User invited to workspace.'
            })
        }

        return res.status(200).json({
            message: 'User invited and email the link successfully.'
        })

    } catch(error) {
        console.error("Error: ", error);
        return res.status(500).json({
            error
        })
    }


})

organizationRouter.post('/join', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const { inviteToken } = req.body;
    const userId = req.user?.id;
    const userEmail = req.user?.email;

    console.log('Invite token: ', inviteToken);

    // invite-token wasn't provided
    if(!inviteToken) {
        return res.status(404).json({
            error: 'Invite token missing!'
        })
    }

    if(!userId || !userEmail) {
        return res.status(401).json({
            error: 'Unauthorized'
        })
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const invite = await tx.organizationInvite.findFirst({
                where: {
                    email: userEmail,
                    inviteToken: inviteToken,
                    expiresAt: { gt: new Date() },
                    status: 'PENDING'
                }
            })

            if(!invite) {
                return null;
            }

            await tx.organizationMember.create({
                data: {
                    orgId: invite.orgId,
                    userId: userId,
                    role: invite.role
                }
            })

            await tx.organizationInvite.update({
                where: { inviteToken: invite.inviteToken },
                data: { status: 'ACCEPTED' }
            });

            return invite.orgId;
        })

        if(!result) {
            return res.status(404).json({
                error: 'Invite is invalid or has expired.'
            })
        }

        return res.status(200).json({
            message: 'Successfully joined the organization.'
        })
    } catch(error) {
        console.error("Error: ", error);
        return res.status(500).json({
            error: 'Could not join the organization.'
        })
    }

})

export default organizationRouter;