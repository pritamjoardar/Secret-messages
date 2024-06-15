"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { toast } from 'sonner'
import { Input } from "@/components/ui/input"
import React from "react";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/app/schemas/signInSchema";
import { ApiResponse } from "@/types/Apiresponse";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { signIn } from "next-auth/react";

const Page = () => {

  const router = useRouter();
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { 
      identifire: "",
      password: "",
    },
  });


    const onSubmit = async(data: z.infer<typeof signInSchema>)=>{
        const result = await signIn('credentials',{
            redirect: false,
            identifire : data.identifire,
            password :  data.password,
        });
        console.log(result);
        if(result?.error){
            if(result.error === 'Error: Incorrect password'){
                toast.error("Incorrect Email or Password");
            }else if(result.error === 'Error: User not found with this email'){
              toast.error("User not found with this email");
            }
            else if(result.error === 'Error: please verify your account before login'){
              toast.error("please verify your account before login");
            }
        }else{
            toast.error(result?.error);
        }
        if(result?.url){
            router.replace('/dashboard');
        }
    }

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-8 md:px-96">
      <div className="w-full max-w-mg p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="font-bold text-3xl">Join secret message</h1>
          <p>Sign in for start your anonymous advanture</p>
        </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="identifire"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
              <FormControl>
                <Input placeholder="email/username" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primaryColor">
          Signin
        </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
      <p>
        Create a Account ?{' '}
        <Link href="/signup" className="text-primaryColor">
          Sign up
        </Link>
      </p>
    </div>
    </div>
    </div>
    </>
  );
};

export default Page;
