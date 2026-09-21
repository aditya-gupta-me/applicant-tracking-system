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
        return res.status(422).json({ error: body.error});
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

        await prisma.$transaction( async (tx) => {
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

            // insert for admin
            await tx.organizationAdmin.create({
                data: {
                    orgId: org.id,
                    adminId
                }
            })
            
            return res.status(200).json({
                message: "Success! Organization created!",
            });
        }) 
    } catch(error) {
        console.error("Transaction failed & rolled back: ", error);
        return res.status(500).json({
            error
        })
    }

})

export default organizationRouter;