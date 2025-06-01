"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { signUpSchema } from "@/schema/signUpSchema";
import { APIResponse } from "@/types/APIResponse";
import axios, { AxiosError } from "axios";

const page = () => {
  const [email, setEmail] = useState("");
  const [emailMsg, setEmailMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedEmail = useDebounceValue(email, 500);
  const router = useRouter();

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkEmailUnique = async () => {
      if (debouncedEmail) {
        setLoading(true);
        setEmailMsg("");

        try {
          const response = await axios.get(
            `/api/check-email-unique?email=${debouncedEmail}`
          );
          setEmailMsg(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<APIResponse>;
          setEmailMsg(
            axiosError.response?.data.message ?? "Error checking the email"
          );
        } finally {
          setLoading(false);
        }
      }
    };

    checkEmailUnique();
  }, [debouncedEmail]);

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

      toast.error("Signup Failed", {
        description: axiosError.response?.data.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <></>
    </div>
  );
};

export default page;
