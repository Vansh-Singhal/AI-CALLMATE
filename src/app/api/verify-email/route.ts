import connectToDB from "@/lib/dbConnect";
import UserDB from "@/model/User";
import { z } from "zod";
import { verifySchema } from "@/schema/verifySchema";

export async function POST(request: Request) {
  connectToDB();

  try {
    let { email, code } = await request.json();
    email = email.replaceAll("%40","@");
    const result = verifySchema.safeParse({ code });
    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Code invalid",
        },
        { status: 400 }
      );
    }

    const user = await UserDB.findOne({ email: email });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "User Verified Successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification Code Expired",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Verification Code Incorrect",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error verifying the email, Error: ", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying the email",
      },
      { status: 500 }
    );
  }
}
