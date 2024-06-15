"use client"
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifySchema } from "@/app/schemas/verifyScheme";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/Apiresponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})
const VerifyAccount = () => {
  const router = useRouter();
  const param = useParams<{ username: string }>();
  // const form = useForm<z.infer<typeof verifySchema>>({
  //   resolver: zodResolver(verifySchema),
  // });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  })
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await axios.post("/api/verifyCode", {
        username: param.username,
        code: data.code,
      });
      toast.success(response.data.message);
      router.replace("/signIn");
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-8 md:px-96">
        <div className="w-full max-w-mg p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="font-bold text-3xl">Verify Account</h1>
            <p>
              Enter the verification code that has been send to your email
              account
            </p>
          </div>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
 
        <Button type="submit" className="bg-primaryColor">Submit</Button>
      </form>
    </Form>
        </div>
      </div>
    </>
  );
};

export default VerifyAccount;
