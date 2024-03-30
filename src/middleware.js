import { NextResponse } from "next/server";
import * as jose from "jose";
export async function middleware(req) {
    // await db.initialize();
    try {
        const path = req.nextUrl?.pathname;
        const token = req.cookies?.get("refreshToken")?.value;
        if (token) {
            const { payload: decodedToken } = await jose.jwtVerify(
                token,
                new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET)
            );
            const user = {
                id: decodedToken.id,
                email: decodedToken.email,
            };
            req.user = user;
        }
        const isPublicPath =
            path == "/user/login" ||
            path == "/user/register" ||
            path == "/user/verify" ||
            path == "/user/verify/";
        if (isPublicPath && token) {
            return NextResponse.redirect(new URL("/", req.nextUrl));
        }
        if (!isPublicPath && !token) {
            return NextResponse.redirect(new URL("/user/login", req.nextUrl));
        }
    } catch (error) {
        console.log("error from middleware", error);
    }
}
export const config = {
    matcher: ["/", "/user/login", "/user/register", "/user/verify/:path*"],
};
