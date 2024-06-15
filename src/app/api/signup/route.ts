import UserModel from "@/app/model/User"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"
import dbConnect from "../../../lib/dbConnect"

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUserName = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerifiedByUserName) {
            return Response.json({
                success: false,
                message: "User already exists"
            }, {status: 400})
        }
            const existingUserByEmail = await UserModel.findOne({ email });
            const verifiedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            if (existingUserByEmail) {
                if(existingUserByEmail.isVerified){
                    return Response.json({
                        success: false,
                        message: "User already exists with this email"
                    }, {status: 400})
                }else{
                    const hashPassword = await bcrypt.hash(password, 10);
                    existingUserByEmail.password = hashPassword;
                    existingUserByEmail.verifyCode = verifiedOtp;
                    existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                    await existingUserByEmail.save();
                }
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                const expieryDaye = new Date();
                expieryDaye.setDate(expieryDaye.getHours() + 1);

                const newUser = new UserModel({
                    username,
                    email,
                    password: hashPassword,
                    verifyCode: verifiedOtp,
                    verifyCodeExpiry: expieryDaye,
                    isVerified: false,
                    isAcceptingMessage: true,
                    messages: []
                })

                await newUser.save();
            }
            const emailResponse = await sendVerificationEmail(
                email,
                username,
                verifiedOtp
            );
            if(!emailResponse.success){
                return Response.json({
                    success: false,
                    message:emailResponse.message
                },
            {
                status: 500
            })
            }
            return Response.json({
                success: true,
                message:"user register successfully. Please verify your email"
            },
        {
            status: 201
        })
        
    } catch (error) {
        console.log("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        })
    }
}