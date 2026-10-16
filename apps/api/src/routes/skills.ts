import express, { Router, Request, Response} from 'express'
import { prisma } from '../lib/prisma'
import { protectedRoute } from '../middleware/auth.middleware';
import z from 'zod';
import { createSkillCategorySchema, createSkillsSchema } from '@repo/schema';
import { normalizeSkillName } from '../utils/normalizeName';

const skillsRouter: Router = express.Router();

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

skillsRouter.get('/get-skills-category', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            error: 'Unauthorized'
        });
    }

    try {
        const organizationId = await getOrganizationId(userId);
        if (!organizationId) {
            return res.status(403).json({
                error: 'You must belong to an organization'
            });
        }

        const skillCategories = await prisma.skillCategory.findMany({
            where: {
                organizationId
            },
            orderBy: {
                categoryName: 'asc'
            },
            select: {
                id: true,
                categoryName: true,
                description: true,
                _count: {
                    select: {
                        skills: true
                    }
                }
            }
        });

        return res.status(200).json({
            skillCategories
        });
    } catch (error) {
        console.error('ERROR: ', error);

        return res.status(500).json({
            error: 'Unable to load skill categories'
        });
    }
});

skillsRouter.get('/get-skills', protectedRoute, async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const organizationId = await getOrganizationId(userId);
        if (!organizationId) {
            return res.status(403).json({ error: 'You must belong to an organization' });
        }

        const skills = await prisma.skill.findMany({
            where: { organizationId },
            orderBy: [{ category: { categoryName: 'asc' } }, { name: 'asc' }],
            select: {
                id: true,
                name: true,
                isActive: true,
                category: {
                    select: {
                        id: true,
                        categoryName: true
                    }
                }
            }
        });

        return res.status(200).json({ skills });
    } catch (error) {
        console.error('Unable to load skills:', error);
        return res.status(500).json({ error: 'Unable to load skills' });
    }
});

skillsRouter.post('/create-skills-category', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const user = req.user?.id;

    if(!user) {
        return res.status(411).json({
            error: 'Unauthorized'
        });
    }

    try {
        const organizationId = await getOrganizationId(user);
        if (!organizationId) {
            return res.status(403).json({
                error: 'You must belong to an organization'
            });
        }

        const body = z.safeParse(createSkillCategorySchema, req.body);

        if(!body.success) {
            return res.status(400).json({
                error: body.error.message
            });
        }

        try {
            await prisma.skillCategory.create({
                data: {
                    categoryName: body.data.categoryName,
                    description: body.data.description,
                    createdAt: body.data.createdAt,
                    organizationId
                }
            });
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
                return res.status(409).json({
                    error: 'A category with this name already exists.'
                });
            }

            throw error;
        }

        return res.status(200).json({
            message: 'Category created successfully'
        })
    } catch(error) {
        console.error("ERROR: ", error);

        return res.status(500).json({
            error
        });
    }

})

skillsRouter.post('/create-skills', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const user = req.user?.id;

    if(!user) {
        return res.status(411).json({
            error: 'Unauthorized'
        })
    }

    try {
        const organizationId = await getOrganizationId(user);
        if (!organizationId) {
            return res.status(403).json({
                error: 'You must belong to an organization'
            });
        }

        const body = z.safeParse(createSkillsSchema, req.body);

        if(!body.success) {
            return res.status(400).json({
                error: body.error.message
            });
        }

        const normalizedName = normalizeSkillName(body.data.name);
        const category = await prisma.skillCategory.findFirst({
            where: {
                id: body.data.categoryId,
                organizationId
            },
            select: {
                id: true
            }
        });

        if (!category) {
            return res.status(404).json({
                error: 'Skill category not found'
            });
        }

        try {
            await prisma.skill.create({
                data: {
                    name: body.data.name,
                    isActive: body.data.isActive,
                    normalizedName,
                    createdAt: body.data.createdAt,
                    categoryId: body.data.categoryId,
                    organizationId
                }
            });
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
                return res.status(409).json({
                    error: 'A skill with this name already exists.'
                });
            }

            throw error;
        }

        return res.status(200).json({
            message: 'Skill created successfully'
        });
    } catch(error) {
        console.error('ERROR: ', error);

        return res.status(500).json({
            error
        })
    }
})

export default skillsRouter;