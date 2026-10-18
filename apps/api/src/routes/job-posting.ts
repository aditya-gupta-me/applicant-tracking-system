import express, { Request, Response, Router } from 'express';
import { prisma } from '../lib/prisma';
import { protectedRoute } from '../middleware/auth.middleware';
import z from 'zod';
import { createJobPostingSchema } from '@repo/schema';

const jobPostingRouter: Router = express.Router();


async function getOrganizationId(userId: string) {
    const membership = await prisma.organizationMember.findFirst({
        where: {
            userId
        },
        select: {
            orgId: true
        }
    });

    return membership?.orgId;
}

jobPostingRouter.post('/create', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const userId = req.user?.id;

    if(!userId) {
        return res.status(411).json({
            error: 'Unauthorized'
        })
    }

    try {
        const organizationId = await getOrganizationId(userId);
        if (!organizationId) {
            return res.status(403).json({
                error: 'You must belong to an organization'
            });
        }

        const body = z.safeParse(createJobPostingSchema, req.body);

        // validation failed
        if(!body.success) {
            return res.status(400).json({
                error: body.error.message
            });
        }
        const tx = await prisma.$transaction(async (tx) => {
            const job = await tx.job.create({
                data: {
                    title: body.data.title,
                    description: body.data.description,
                    applyBy: body.data.applyBy,
                    location: body.data.location,
                    startDate: body.data.startDate,
                    type: body.data.type,
                    departmentId: body.data.departmentId,
                    organizationId: organizationId,
                    userId: userId
                }
            })
            const jobSkills = body.data.selectedSkill?.map((skill) => ({
                jobId: job.id,
                skillId: skill.id,
                isRequired: skill.isRequired,
                importance: skill.importance,
                minimumYearsExperience: skill.minimumYearsExperience
            }));

            console.log("Came here 1")
            if(!jobSkills) {
                return res.status(200).json({
                    jobId: job.id
                });
            }

            // insert the job-skill
            await tx.jobSkill.createMany({
                data: jobSkills
            })

            console.log('Came here 2')
            return res.status(200).json({
                jobId: job.id
            });
        })
    } catch(error) {
        console.error('ERROR: ', error);
        return res.status(500).json({
            error
        })
    }
})

jobPostingRouter.get(['/get', '/view'], protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const user = req.user;

    if(!user?.id) {
        return res.status(403).json({
            message: 'Unauthorized'
        })
    }

    try {
        const orgId = await getOrganizationId(user.id)

        if(!orgId) {
            return res.status(403).json({
                message: 'You must belong to an organization'
            });
        }

        const jobs = await prisma.job.findMany({
            where: {
                organizationId: orgId,
            },
            include: {
                department: true,
                jobSkills: {
                    include: {
                        skill: true,
                    },
                },
            },
        })

        return res.status(200).json({
            jobs,
        })

    } catch(error) {
        console.error("ERROR: ", error);
        return res.status(500).json({
            error
        })
    }
})

jobPostingRouter.get('/get/:jobId', protectedRoute, async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    try {
        const organizationId = await getOrganizationId(userId);
        if (!organizationId) {
            return res.status(403).json({ message: 'You must belong to an organization' });
        }

        const job = await prisma.job.findFirst({
            where: {
                id: req.params.jobId,
                organizationId,
            },
            include: {
                department: true,
                jobSkills: {
                    include: {
                        skill: true,
                    },
                },
            },
        });

        if (!job) {
            return res.status(404).json({ message: 'Job posting not found' });
        }

        return res.status(200).json({ job });
    } catch (error) {
        console.error("ERROR: ", error);
        return res.status(500).json({ error });
    }
});

export default jobPostingRouter;