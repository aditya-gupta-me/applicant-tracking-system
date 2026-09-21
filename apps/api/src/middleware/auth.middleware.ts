import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth"


export const protectedRoute = async (req, res, next) => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers)
        });

        if(!session){
            return res.status(401).json({
                error: "Unauthorized"
            });
        }

        req.user = session.user;
        req.session = session.session;
        next();
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}