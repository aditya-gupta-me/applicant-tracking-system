import express, { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import { protectedRoute } from "../middleware/auth.middleware";


const organizationAdmin: Router = express.Router();

organizationAdmin.post('/is-admin', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const adminId = req.user?.id;

    if(!adminId){
        return res.status(401).json({
            error: "Unauthorized"
        })
    }

    const organizationExists = await prisma.organizationAdmin.findUnique({
        where: {
            adminId: adminId
        }
    })

    if(!organizationExists){
        return res.status(404).json({
            exists: false
        })
    }

    return res.status(200).json({
        exists: true
    })
})

export default organizationAdmin;