import express, { Router, Request, Response } from "express";

const healthRouter: Router = express.Router();


// equivalent to '/live'
healthRouter.get('/',  (req: Request, res: Response) => {
    console.log(req.method, req.url);
    
    return res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    })
})

healthRouter.get('/ready', async (req: Request, res: Response) => {
    console.log(req.method, req.url);

    const databaseHealthy = await checkDatabase();
    if(!databaseHealthy){
        return res.status(503).json({
            status: 'unavailable',
        })
    }

    return res.status(200).json({
        status: 'ok',
    })
})

// simulating db health-check
async function checkDatabase(): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, 2000)
    });
}


export default healthRouter;