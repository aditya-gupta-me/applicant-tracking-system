import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma"; // your prisma client instance
import { createAuthMiddleware } from "better-auth/api";

export const auth = betterAuth({
    trustedOrigins: ["http://localhost:5173"],
    
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),

    emailAndPassword: {
        enabled: true,
    },

    socialProviders: {
        // TODO: add more providers
    },

    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if(ctx.path === '/sign-up/email' || ctx.path === '/sign-up/social'){
                const user = ctx.context.newSession?.user;

                if(user){
                    await prisma.onboarding.create({
                            data: {
                                userId: user.id
                            }
                        })
                }
            }
        })
    }
});