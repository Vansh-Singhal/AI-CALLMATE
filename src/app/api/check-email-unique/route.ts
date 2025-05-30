import connectToDB from "@/lib/dbConnect";
import UserDB from "@/model/User";

export async function GET(request: Request) {

  await connectToDB();

  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      email: searchParams.get("email"),
    };

    const { email } = queryParam;
    const user = await UserDB.findOne({ email, isVerified: true });
    if (user) {
      return Response.json(
        {
          success: false,
          message: "Email already exists",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Email is unique",
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error checking email, Error: ", error);
    return Response.json(
      {
        success: false,
        message: "Error checking email",
      },
      { status: 500 }
    );
  }
}
