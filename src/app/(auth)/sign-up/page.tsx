"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { toast } from "sonner";
import { signUpSchema } from "@/schema/signUpSchema";
import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const page = () => {
  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedEmail = useDebounceCallback(setEmail, 500);
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      name:""
    },
  });

  useEffect(() => {
    const checkEmailUnique = async () => {
      if (email) {
        setEmailMsg("");
        
        try {
          const response = await axios.get(
            `/api/check-email-unique?email=${email}`
          );
          setEmailMsg(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<APIResponse>;
          setEmailMsg(
            axiosError.response?.data.message ?? "Error checking the email"
          );
        }
      }
    };

    checkEmailUnique();
  }, [email]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<APIResponse>("/api/sign-up", data);

      toast.success("Success", {
        description: response.data.message,
      });

      router.replace(`/verify/${email}`);
    } catch (error) {
      console.log("Error in signup of user");
      const axiosError = error as AxiosError<APIResponse>;
      console.error(axiosError.response?.data.message);

      toast.error("Signup Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Create your first smart meeting
          </h1>
          <p className="mb-4">Signup to your account</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john.doe@gmail.com"
                      type="email"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedEmail(e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormDescription className={emailMsg === "Email already exists" ? "text-red-500" : "text-green-500"}>
                    {emailMsg ? emailMsg : ""}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
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
                    <Input placeholder="password" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
