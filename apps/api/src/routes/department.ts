import express, {Router, Request, Response} from 'express';
import { prisma } from '../lib/prisma';
import { protectedRoute } from '../middleware/auth.middleware';
import { z } from 'zod';
import { createDepartmentSchema } from '@repo/schema';

const departmentRouter: Router = express.Router();

departmentRouter.post('/create', protectedRoute, async (req: Request, res: Response ) => {
    console.log(req.method, req.baseUrl + req.path);

    const adminId = req.user?.id;

    if(!adminId) {
        return res.status(401).json({
            error: 'Unauthorized'
        })
    }

    try {
        const checkAdmin = await prisma.organization.findFirst({
            where: {
                adminId: adminId,
            }
        })

        // not admin
        if(!checkAdmin) {
            return res.status(403).json({
                message: 'You are not allowed to do this action'
            })
        }

        const body = z.safeParse(createDepartmentSchema, req.body);

        if(!body.success) {
            return res.status(400).json({
                error: body.error.message
            });
        }

        // create department
        try {
            await prisma.department.create({
                data: {
                    name: body.data.name,
                    organizationId: checkAdmin.id
                }
            })
        } catch (error: unknown) {
            if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
                return res.status(409).json({
                    error: 'A department with this name already exists.'
                })
            }

            throw error;
        }

        return res.status(200).json({
            message: 'Success department created'
        })
    } catch(error) {
        console.error('Error: ', error);
        
        return res.status(500).json({
            error: 'Unable to create department'
        });
    }

})

departmentRouter.get('/getAll', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const user = req.user?.id;

    if(!user) {
        return res.status(411).json({
            error: 'Unauthorized'
        })
    }

    try {
        const membership = await prisma.organizationMember.findFirst({
            where: {
                userId: user
            },
            select: {
                orgId: true
            }
        });

        if (!membership) {
            return res.status(403).json({
                error: 'You must belong to an organization'
            });
        }

        const departments = await prisma.department.findMany({
            where: {
                organizationId: membership.orgId
            },
            orderBy: {
                name: 'asc'
            }
        })

        return res.status(200).json({
            departments
        })
    } catch(error) {
        console.error('ERROR: ', error);
        return res.status(500).json({
            error
        })
    }
})


export default departmentRouter;