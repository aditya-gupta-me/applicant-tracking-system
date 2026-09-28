import express, { Request, Response, Router } from "express";
import { prisma } from "../lib/prisma";
import { protectedRoute } from "../middleware/auth.middleware";


const organizationAdmin: Router = express.Router();

organizationAdmin.get('/is-admin', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const userId = req.user?.id;

    if(!userId){
        return res.status(401).json({
            error: "Unauthorized"
        })
    }

    const adminExists = await prisma.organizationMember.findFirst({
        where: {
            userId: userId,
            role: 'ADMIN'
        }
    })

    return res.status(200).json({
        exists: Boolean(adminExists)
    })
})

export default organizationAdmin;