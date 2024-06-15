"use client";
import { Message } from "@/app/model/User";
import { acceptMessageSchema } from "@/app/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/Apiresponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Navbar from "@/components/Navbar";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);
  const [baseUrl, setBaseUrl] = useState("");

  const handleDeleteMessages = async(messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    try {
      const res = await axios.delete(`/api/deleteMessage/${messageId}`);
      toast.success(res?.data?.message);
    } catch (error) {
      console.error(error);
      setMessages(prevMessages => [...prevMessages, ...messages.filter(m => m._id === messageId)]);
    }
  };

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const res = await axios.get<ApiResponse>("/api/acceptMessage");
      setValue("acceptMessage", res.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch message settings"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(false);
      try {
        const res = await axios.get<ApiResponse>("/api/getMessages");
        setMessages(res.data.messages || []);
        if (refresh) {
          toast.success("Refresh Messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message ||
            "Failed to fetch message settings"
        );
      } finally {
        setLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    fetchAcceptMessages();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessages, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const res = await axios.post("/api/acceptMessage", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(res.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch message settings"
      );
    }
  };
  const username = session?.user as User;
  const profileUrl = `${baseUrl}/u/${username?.username}`;
  const copyToClipbord = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Copied to Clipbord");
  };
  if (!session || !session.user) {
    return <>
    <Navbar/>
    <div className="flex justify-center mt-5">
    Please Login
    </div>
    </>;
  }
  return (
    <>
    <Navbar/>
      <div className="flex flex-col md:px-20 justify-center md:justify-start">
        <div className="flex flex-col items-start gap-2 p-5">
          <h1 className="mt-2 font-bold">Copy your unique link</h1>
          <div className="mt-2 border p-2 bg-gray-100 rounded-sm flex items-center gap-3">
            <h1 className="text-[10px] md:text-xl">{profileUrl}</h1>
            <Button onClick={copyToClipbord}>copy</Button>
          </div>
          <span className="flex gap-2 items-center">
            <Switch
              {...register("acceptMessages")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitchLoading}
            />
            <span className="">
              Accept Messages :{acceptMessages ? "On" : "Off"}
            </span>
          </span>
        </div>
        {/* messages div */}
        <div className="mt-5 flex flex-wrap">
          {
          messages.length > 0 ? (
            messages.map(({content,_id,createdAt},index)=>(
              <div key={index} className="shadow-md border rounded-md p-2 w-fit m-2 flex gap-2 md:gap-20">
                <div className="flex flex-col gap-2">
                <p className="font-bold  md:text-2xl">{content}</p>
                <p>{createdAt.toString()}</p>
                </div>
                <div>
                <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">X</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone &#46; This will permanently delete your
            message and remove your data from our servers &#46;
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className="bg-red-500" onClick={()=>handleDeleteMessages(_id as string)}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </div>
              </div>
            ))
          ) :(
            <p>No messages</p>
          )
   }
        </div>
      </div>
      </>
  );
};

export default Page;
