import express, { Router, Request, Response } from "express";
import { prisma } from "../lib/prisma";

const healthRouter: Router = express.Router();


// equivalent to '/live'
healthRouter.get('/',  (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);
    
    return res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    })
})

// api-endpoint for db health-check
healthRouter.get('/ready', async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const databaseHealthy = await checkDatabase();
    if(!databaseHealthy){
        return res.status(503).json({
            db_status: 'unavailable',
        })
    }

    return res.status(200).json({
        db_status: 'ok',
    })
})

// db health-check function
async function checkDatabase(): Promise<boolean> {

    // error-handling
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    }
    catch (error) {
        console.error("Database health check failed: ", error);
        return false;
    }
}


export default healthRouter;