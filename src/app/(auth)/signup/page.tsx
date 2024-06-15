"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import axios,{AxiosError} from "axios"
import { useDebounceCallback } from "usehooks-ts";
import { toast } from 'sonner'
import { Input } from "@/components/ui/input"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/app/schemas/signUpSchema";
import { ApiResponse } from "@/types/Apiresponse";
import { Button } from "@/components/ui/button"
import {Loader2 } from "lucide-react"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounce = useDebounceCallback(setUsername, 300);
  const router = useRouter();
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { 
      username: "",
      email: "",
      password: "",
    },
  });

    useEffect(()=>{
        const checkUsernameUnique = async () => {
            if(username){
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/ckeck-unique-username?username=${username}`);
                    let messages = response.data.message;
                    setUsernameMessage(messages);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message?? "Error checking username");
                }finally{
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    }
    ,[username]);

    const onSubmit = async(data: z.infer<typeof signUpSchema>)=>{
        setIsSubmitting(true);
        try {
            const response = await axios.post<ApiResponse>('/api/signup',data);
            toast.success(response.data.message);
            router.replace(`/verify/${username}`);
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error in signup of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast.error(errorMessage);
            setIsSubmitting(false);
        }
    }

  return (
    <>
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-8 md:px-96">
      <div className="w-full max-w-mg p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="font-bold text-3xl">Secret Messages</h1>
          <p>Sign up for start your anonymous advanture</p>
        </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field}
                onChange={(e)=>{
                  field.onChange(e);
                  debounce(e.target.value);
                }} />
              </FormControl>
                {isCheckingUsername && <Loader2 className= "animate-spin"/>}
                <p  className={`text-sm ${usernameMessage==='Username is available'?'text-green-500':'text-red-500'}`}>
                 {usernameMessage}
                </p>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* for email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* for password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="bg-primaryColor">
          {
            isSubmitting? (<>
            <Loader2 className="mr-2 h-4 w-4">Please wait</Loader2>
            </>) : ("Signup")
          }
        </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
      <p>
        Already a member ?{' '}
        <Link href="/signIn" className="text-primaryColor">
          Sign in
        </Link>
      </p>
    </div>
    </div>
    </div>
    </>
  );
};

export default Page;
