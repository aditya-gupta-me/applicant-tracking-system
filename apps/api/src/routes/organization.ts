import express, { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { protectedRoute } from "../middleware/auth.middleware";
import { z } from "zod";
import slugify from "slugify";
import { createOrganizationSchema } from '@repo/schema';
import { randomShortId } from "../utils/slugGenerator";

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
            const org = await tx.organization.create({
                data: {
                    name: body.data.name,
                    slug: slug,
                    email: body.data.email,
                    website: body.data.website,
                    image: body.data.image,
                    establishedDate: body.data.establishedDate
                }
            });

            // insert for user table
            await tx.user.update({
                where: {
                    id: adminId,
                },
                data: {
                    organizationId: org.id
                }
            })

            // insert for admin
            await tx.organizationAdmin.create({
                data: {
                    orgId: org.id,
                    adminId
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

organizationRouter.get('/user-exists', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const userId = req.user?.id;

    if(!userId) {
        return res.status(401).json({
            error: "Unauthorized"
        })
    }

    const userExists = await prisma.user.findUnique({
        where: {
            id: userId,
            organizationId: { not : null }
        }
    })

    return res.status(200).json({
        exists: Boolean(userExists)
    })
})

export default organizationRouter;