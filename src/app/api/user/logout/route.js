import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    console.log("request", req);
    try {
        cookies().delete("accessToken");
        cookies().delete("refreshToken");
        return NextResponse.json(200, {
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
        });
    }
}
