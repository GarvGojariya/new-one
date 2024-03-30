import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const { db } = require("../../../../../database/db");

await db.initialize();

export async function POST(req) {
    const generateAccessTokenAndRefreshToken = async (userId) => {
        try {
            const user = await db.User.findOne(
                {
                    where: {
                        id: userId,
                    },
                },
                { attributes: ["id", "name", "email"] }
            );
            const accessToken = await user.generateAccessToken();
            const refreshToken = await user.generateRefreshToken();
            user.refreshToken = refreshToken;
            await user.save({
                validateBeforeSave: false,
            });

            return {
                accessToken,
                refreshToken,
            };
        } catch (error) {
            return NextResponse.json(
                {
                    message: error.message,
                },
                {
                    status: 500,
                }
            );
        }
    };
    try {
        const reqBody = await req.json();
        const { email, password } = reqBody;
        if (!(email && password)) {
            return NextResponse.json(
                {
                    message: "Email and password are required",
                },
                {
                    status: 400,
                }
            );
        }
        const existedUser = await db.User.findOne({
            where: {
                email: email,
            },
        });
        if (!existedUser) {
            return NextResponse.json(
                {
                    message: "User with this email is not found",
                },
                {
                    status: 404,
                }
            );
        }
        const isMatch = await existedUser.isPasswordCorrect(password);
        if (!isMatch) {
            return NextResponse.json(
                {
                    message: "Password is incorrect",
                },
                {
                    status: 401,
                }
            );
        }
        if (!existedUser.isVerified) {
            return NextResponse.json(
                {
                    message: "Please verify your email before login",
                },
                {
                    status: 401,
                }
            );
        }
        console.log({ existedUser });
        const { accessToken, refreshToken } =
            await generateAccessTokenAndRefreshToken(existedUser.id);
        const loggedInUser = await db.User.findOne({
            where: {
                id: existedUser.id,
            },
            attributes: ["id", "name", "email", "isVerified"],
        });
        cookies().set("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
        });
        cookies().set("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
        });
        return NextResponse.json(
            {
                loggedInUser,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}
