import dbConnect from "@/lib/dbConnect";
import { z } from "zod"
import UserModel from "@/app/model/User";
import { usernameValidation } from "@/app/schemas/signUpSchema";

const usernameQueryScheme = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    // if(request.method !== "GET"){
    //     return Response.json({
    //         success: false,
    //         message: 'Method not supported',
    //     }, {
    //         status: 405
    //     })
    // }
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryparam = {
            username: searchParams.get("username")
        }
        const result = usernameQueryScheme.safeParse(queryparam);

        if (!result.success) {
            const usernameErrors = result.error.format().
                username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0
                    ? usernameErrors.join(', ')
                    : 'invalid query parameters',
            }, {
                status: 400
            })
        }
        const { username } = result.data;
        const existingUser = await UserModel.findOne({username, isVarified: true});
        if(existingUser){
            return Response.json({
                success: false,
                message: "Username is already available"
            }, {
                status: 400
            })
        }
        return Response.json({
            success: true,
            message: "Username is available"
        }, {
            status: 200 
        })
    } catch (error) {
        console.error("Error checking usernames", error);
        return Response.json({
            success: false,
            message: "Error checking usernames"
        },
            {
                status: 500
            })
    }
}