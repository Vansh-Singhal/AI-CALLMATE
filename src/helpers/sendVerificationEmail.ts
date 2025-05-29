import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { APIResponse } from "@/types/APIResponse";

export const sendVerificationEmail = async (
  name : string,
  email: string,
  verifyCode: string
): Promise<APIResponse> => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "AI-CALLMATE | Email Verification Code",
      react: VerificationEmail({ name: name, otp: verifyCode }),
    });

    return { success: true, message: "Verification Email Sent successfully" };
  } catch (error) {
    console.log("Error sending Email");
    return { success: false, message: "Failed to send verification Email" };
  }
};
