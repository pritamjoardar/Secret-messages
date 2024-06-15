import {NextAuthOptions } from "next-auth"
import  CredentialsProvider  from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect"
import UserModel from "@/app/model/User"

export const authOptions: NextAuthOptions = {
    providers :[
        CredentialsProvider({
            id:"credentials",
            name:"credentials",
            credentials:{
                email: {label:"Email", type:"text"},
                password:{label:"Password", type:"password"}
            },
            async authorize(credentials:any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifire},
                            {username: credentials.identifire}
                        ]
                    });
                    if(!user){
                        throw new Error("User not found with this email");
                    }
                    if(!user.isVerified){
                        throw new Error("please verify your account before login");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(isPasswordCorrect){
                        return user;
                    }else{
                        throw new Error("Incorrect password");
                    }
                } catch (error:any) {
                    throw new Error(error);
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token ;
        },
        async session({session,token}){
            if(token){
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session
        },
    },
    pages:{
        signIn:'/signin',
    },
    session:{
        strategy:"jwt"
    }
}