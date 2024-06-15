"use client";
import axios , {AxiosError}from 'axios'
import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { toast } from 'sonner';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
  import Link from 'next/link';
  import { Loader2 } from "lucide-react"
import Navbar from '@/components/Navbar';

  const formSchema = z.object({
    content: z.string().min(10, {
      message: "Content must be at least 10 characters.",
    }),
  });

 

const Page = ({params}:{params:{username:string}}) => {
    const usernameParams = params.username;
    const [loading, setIsLoading] = useState<boolean>(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          content:""
        },
      })
    const sendMessage = async(data: z.infer<typeof formSchema>)=>{
            setIsLoading(true);
        try {
            const res = await axios.post('/api/sendMessage',{username: usernameParams,content:data.content});       
            toast.success(res.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<any>;
            let errorMessage = axiosError.response?.data.message;
            toast.error(errorMessage);
        }finally{
            setIsLoading(false);
        }

    }

    const suggestMessages = async () =>{
              const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."
              try {
                const response = await axios.post('/api/suggestMessages',prompt);
                console.log(response);
              } catch (error) {
                console.error(error)
              }

    }
  return (
    <>
    <Navbar/>
        <div className='flex justify-center p-8'>
            <h1 className="font-bold text-3xl md:text-4xl">Public Profile</h1>
        </div>
        <div className="flex justify-center">
        <div className="p-3 flex gap-2 flex-col">
            <p className='font-bold md:text-xl'>Send secret message to @ {usernameParams}</p>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(sendMessage)} className="space-y-2">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input className='md:w-[40rem]' placeholder="Enter messages here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center">
        <Button disabled={loading} type="submit" className='bg-primaryColor'>Send{loading?<Loader2/>:''}</Button>
        </div>
      </form>
    </Form>
    <div className=" flex justify-center flex-col gap-2 items-center mt-10">
          <h1 className='font-bold'>To Participate in a Secret Mission</h1>
        <Link href='/signup'><Button className='w-min'>Create a Account</Button></Link>
    </div>

        </div>
        </div>
    </>
  )
}

export default Page
