"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Logo from "../assets/logo.png"

const Navbar = () => {
  const { data: session, status } = useSession();
  const user: User | undefined = session?.user as User;

  // Determine if session is loading, logged in, or logged out
  const loading = status === "loading";
  const loggedIn = !!session;

  return (
    <>
      <nav>
        <div className="flex justify-between p-8 border items-center md:px-28">
          {loading ? (
            <h1 className="font-bold text-2xl">Loading...</h1>
          ) : loggedIn ? (
            <>
              <h1 className="font-bold text-2xl md:text-3xl">Welcome, {user?.username || user?.email}</h1>
              <Button onClick={() => signOut()} className="bg-primaryColor">Sign Out</Button>
            </>
          ) : (
            <>
              {/* <h1 className="font-bold text-2xl">Secret Messages</h1> */}
              <Image src={Logo.src} alt="Secret Messages" height={300} width={300} className="w-52 md:w-72"/>
              <Link href="/signIn">
                <Button className="bg-primaryColor">Login</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
