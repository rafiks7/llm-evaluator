import { NextResponse } from "next/server";
// Must precede any llm module imports
// import * as Langtrace from "@langtrace/typescript-sdk";
// Langtrace.init({ api_key: process.env["LANGTRACE_API_KEY"] });
import Groq from "groq-sdk";

const client = new Groq({
  apiKey: process.env["GROQ_API_KEY"],
});

type RequestBody = {
  systemPrompt: string;
  selectedModels: Array<string>;
  userMessage: string;
};

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();

    const { systemPrompt, selectedModels, userMessage } = body;

    if (!systemPrompt || !selectedModels || !userMessage) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    console.log("selectedModels", selectedModels);

    // Simulate responses for each selected model
    const results = await Promise.all(
      selectedModels.map(async (model) => {
        // const simulatedResponse = Simulated response for "${userMessage}" using model "${model}";
        const chatCompletion = await client.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          model: model,
        });

        const simulatedScore = parseFloat((Math.random() * 10).toFixed(2));
        const response = chatCompletion.choices[0].message.content;

        console.log("response", response);

        return {
          model,
          output: response,
          score: simulatedScore,
        };
      })
    );

    console.log("results", results);

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
