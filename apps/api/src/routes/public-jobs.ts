import express, {Request, Response, Router} from 'express';
import { prisma } from '../lib/prisma';

const publicJobRouter: Router = express.Router();

publicJobRouter.get('/', async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    try {
        const jobs = await prisma.job.findMany({
            where: {
                status: "PUBLISHED",
                OR: [
                    { applyBy: null },
                    { applyBy: {gte: new Date() } },
                ]
            },
            select: {
                id: true,
                title: true,
                description: true,
                location: true,
                type: true,
                applyBy: true,
                startDate: true,
                department: {
                    select: {
                        name: true
                    }
                },
                jobSkills: {
                    select: {
                        isRequired: true,
                        skill: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                publishedAt: "desc"
            }
        })

        return res.status(200).json({
            jobs
        });
    } catch (error) {
        console.error("Failed to fetch jobs", error);

        return res.status(500).json({
            error: "Unable to load jobs"
        });
    }
})

publicJobRouter.get('/:id', async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const id = req.params.id;

    if(!id) {
        return res.status(403).json({
            error: 'ID parameter was not provided!'
        })
    }

    try {
        console.log("ID: ", id);

        const job = await prisma.job.findFirst({
            where: {
                id: id.toString(),
                status: "PUBLISHED",
                OR: [
                    { applyBy: null },
                    { applyBy: {gte: new Date() } },
                ]
            },
            select: {
                id: true,
                title: true,
                description: true,
                location: true,
                type: true,
                applyBy: true,
                startDate: true,
                department: {
                    select: {
                        name: true
                    }
                },
                jobSkills: {
                    select: {
                        isRequired: true,
                        skill: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                publishedAt: "desc"
            }
        })

        return res.status(200).json({
            job
        });
    } catch (error) {
        console.error('Failed to fetch Job ', error);

        return res.status(500).json({
            error: 'Unable to load the job'
        });
    }
})

export default publicJobRouter;