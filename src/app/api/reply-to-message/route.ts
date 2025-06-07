import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return Response.json(
        {
          success: false,
          message: "Message Required",
        },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: openai("o3-mini"),
      prompt: prompt,
    });

    return Response.json(
      {
        success: true,
        message: "Response generated",
        text,
      },
      { status: 400 }
    );
  } catch (error) {
    console.log("Error generating message", error);
    return Response.json(
      {
        success: false,
        message: "Error generating response",
      },
      { status: 500 }
    );
  }
}
