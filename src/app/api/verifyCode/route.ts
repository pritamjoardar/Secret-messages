import dbConnect from "@/lib/dbConnect";
import { z } from "zod"
import UserModel from "@/app/model/User";
import { usernameValidation } from "@/app/schemas/signUpSchema";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                {
                    status: 500
                })
        }
        const isCodevaid = user.verifyCode === code;
        const isCodeNotExpiery = new Date(user.verifyCodeExpiry) > new Date();
        if (isCodevaid && isCodeNotExpiery) {
            user.isVerified = true;
            await user.save();
            return Response.json({
                success: true,
                message: "Account verified successfully"
            },
                {
                    status: 200
                })
        } else if (!isCodeNotExpiery) {
            return Response.json({
                success: false,
                message: "Verification is expired please signup again to get a new code"
            },
                {
                    status: 400
                })
        }else{
            return Response.json({
                success: false,
                message:"Incorrect verification code"
            },
                {
                    status: 400
                })
        }
    } catch (error) {
        console.error("Error verifying user", error);
        return Response.json({
            success: false,
            message: "Error verifying user"
        },
            {
                status: 500
            })
    }
}