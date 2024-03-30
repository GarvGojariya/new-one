import { decrypt } from "@/app/utils/auth";
import { NextResponse } from "next/server";
import { db } from "../../../../../database/db";
import dayjs from "dayjs";

db.initialize();
export async function POST(req) {
    const reqBody = await req.json();
    const { iv, encryptedData } = reqBody;
    const token = {
        iv: iv,
        encryptedData: encryptedData,
    };
    let decryptedContent = await decrypt(token);
    let data = JSON.parse(decryptedContent);
    const diffInMinutes = dayjs().diff(data.expireIn, "minute");
    if (data.id && diffInMinutes <= process.env.LINK_EXPIRE_TIME) {
        try {
            const user = await db.User.findOne({
                where: {
                    id: data.id,
                },
            });
            if (user) {
                user.isVerified = true;
                await user.save();
                return NextResponse.json({
                    success: true,
                    message: "User verified",
                });
            }
            if (!user) {
                return NextResponse.json({
                    success: false,
                    message: "User not found",
                });
            }
        } catch (error) {
            return NextResponse.json({
                success: false,
                message: "Something went wrong",
            });
        }
    }

    return NextResponse.json({});
}
