"use client"
import React from 'react'
import { Message } from '@/app/model/User'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
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
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
  
type MessageCardProps = {
    message: Message;
  onMessageDelete: ( messageId: string ) => void
}

const MessageCard = ({message,onMessageDelete}:
    MessageCardProps
) => {
    const handleDelete = async () => {
      const res = await axios.delete(`/api/deleteMessage/${message._id}`);
      toast.success(res.data.message);
    }
  return (
    <Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">X</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <p>Card Footer</p>
  </CardFooter>
</Card>

  )
}

export default MessageCard
