"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
          AI-CALLMATE
        </Link>
        {session ? (
          <>
            <span className="mr-4">Welcome, {user.name}</span>
            <Button className="w-full md:w-auto" onClick={() => signOut()}>
              Logout
            </Button>
          </>
        ) : (
          <div className="w-1/2 md:w-auto flex gap-2">
            <Link href="/sign-in">
              <Button className="w-full cursor-pointer">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button className="w-full cursor-pointer">Signup</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
