import { NextResponse, NextRequest } from "next/server";
import { auth } from "./app/lib/auth";

export async function proxy(req: NextRequest) {
    const isAuthenticated = await auth.api.getSession({
        headers: req.headers,
    });

    const isLoginPage = req.nextUrl.pathname === "/login";

    if (isAuthenticated && isLoginPage) {
        return NextResponse.redirect(new URL("/jobs", req.url));
    }

    if (!isAuthenticated && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/dashboard", "/settings", "/my-account", "/jobs", "/jobs/:id"],
};