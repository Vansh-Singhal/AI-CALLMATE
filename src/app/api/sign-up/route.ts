import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import connectToDB from "@/lib/dbConnect";
import UserDB from "@/model/User";
import bcrypt, { genSalt } from "bcryptjs";

export async function POST(request: Request) {
  await connectToDB();
  try {
    const { email, password, name } = await request.json();
    const existingVerifiedUser = await UserDB.findOne({
      email,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Email is already taken",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await UserDB.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUser) {
      if (existingUser.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email is already taken",
          },
          {
            status: 400,
          }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUser.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserDB({
        email,
        name,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
      });

      await newUser.save();

      //SEND VERIFICATION EMAIL
      const emailResponse = await sendVerificationEmail(
        name,
        email,
        verifyCode
      );
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          {
            status: 500,
          }
        );
      }

      return Response.json(
        {
          success: true,
          message: "User registered Successfully. Please Verify your Email",
        },
        {
          status: 201,
        }
      );
    }
  } catch (error) {
    console.log("Error registering user, Error: ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering User",
      },
      {
        status: 500,
      }
    );
  }
}
