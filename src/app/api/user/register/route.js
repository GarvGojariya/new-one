import { db } from "../../../../../database/db";
import { Op } from "sequelize";
import { NextResponse } from "next/server";
import {
    generateEncryptedVarifyLink,
    sendEmailWithVarifyLink,
} from "@/app/utils/auth";

await db.initialize();
export async function POST(req) {
    const reqBody = await req.json();
    const { name, email, password } = reqBody;
    try {
        const existingUser = await db.User.findOne({
            where: { [Op.or]: [{ email: email }, { name: name }] },
        });
        if (existingUser && existingUser.isVerified) {
            return NextResponse.json(
                {
                    message:
                        "User with this email or name already exists. Please login.",
                },
                {
                    status: 403,
                }
            );
        }
        if (existingUser && !existingUser?.isVerified) {
            try {
                const user = await db.User.findOne({
                    where: { email: existingUser.email },
                });
                user.name = name;
                user.email = email;
                user.password = password;
                await user.save();
                if (user) {
                    const token = await generateEncryptedVarifyLink(user);
                    const link = `${process.env.BASE_URL_FOR_WEB}/verify/${token.iv}/${token.encryptedData}`;

                    await sendEmailWithVarifyLink(
                        user.email,
                        link,
                        "Click the following link to complete your registration",
                        "Registration Confirmation"
                    );
                } else {
                    return { success: false, message: "Error in sending mail" };
                }
                return NextResponse.json(
                    {
                        user,
                    },
                    { status: 201 }
                );
            } catch (error) {
                throw new ApiError({
                    statusCode: error.status || 500,
                    message:
                        error.message ||
                        "Something went wrong while updating existing user ",
                });
            }
        }

        const newUser = await db.User.create({
            name: name,
            email: email,
            password: password,
        });
        const user = await db.User.findOne({
            where: { email: newUser.email },
            attributes: ["id", "name", "email", "isVerified"],
        });
        if (user) {
            const token = await generateEncryptedVarifyLink(user);
            const link = `${process.env.BASE_URL_FOR_WEB}/verify/${token.iv}/${token.encryptedData}`;

            await sendEmailWithVarifyLink(
                user.email,
                link,
                "Click the following link to complete your registration",
                "Registration Confirmation"
            );
        }
        return NextResponse.json(
            {
                user,
            },
            { status: 201 },
            { statusText: "User created successfully" }
        );
    } catch (error) {
        throw new ApiError({
            statusCode: error.status || 500,
            message:
                error.message ||
                "Something went wrong while initializing database",
        });
    }
}
