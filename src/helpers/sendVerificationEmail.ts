import { resend } from "../lib/resend"; 
import VerificationEmail from "../../emails/verificationsEmails";
import { ApiResponse } from "@/types/Apiresponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string
): Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: 'Secret Message | Verification code',
            react: VerificationEmail({username,otp:verifycode} ),
          });
        return {
            success : true,
            message : "Verification email send successfully"
        }
    } catch (error) {
        console.error("Error sending verification email");
        return {
            success : false,
            message : "Error sending verification email"
        }
    }
}