import express, { Router, type Request, type Response } from "express";
import { protectedRoute } from "../middleware/auth.middleware";
import { prisma } from "../lib/prisma";

const userRouter: Router = express.Router();

userRouter.get('/get-details', protectedRoute, async (req: Request, res: Response) => {
    console.log(req.method, req.baseUrl + req.path);

    const userId = req.user?.id;

    if(!userId) {
        return res.status(411).json({
            error: 'Unauthorized'
        })
    }

    try {
        const userDetails = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        return res.status(200).json({
            user: {
                name: userDetails?.name,
                email: userDetails?.email,
                imageUrl: userDetails?.image,
                createdAt: userDetails?.createdAt
            }
        })
    } catch(error) {
        console.error("ERROR: ", error);

        return res.status(500).json({
            error
        })
    }      
})

export default userRouter;