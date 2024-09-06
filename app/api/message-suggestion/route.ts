import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // const { prompt } = await request.json();
    const prompt = "Generate content in 200 chars for care provider itself";

    const requestBody = {
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.5,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 800,
      stop: null,
    };

    const response = await axios.post(
      process.env.NEXT_PUBLIC_AUTO_SUGGEST_API_URL!,
      requestBody,
      {
        params: {
          "api-version": process.env.NEXT_PUBLIC_AUTO_SUGGEST_API_VERSION ?? "",
          "api-key": process.env.NEXT_PUBLIC_AUTO_SUGGEST_API_KEY ?? "",
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // return NextResponse.json(response.data);
    return NextResponse.json(response.data.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// const handalAi = async () => {
//   try {
//     const response = await axios.post("/api/messageSuggestion", "hello");
//     console.log("Response:", response.data);
//   } catch (error) {
//     console.error("Error fetching suggestions:", error);
//   }
// };
