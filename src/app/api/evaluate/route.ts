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

        console.log("response:", response);

        return {
          model,
          output: response,
          score: simulatedScore,
        };
      })
    );

    console.log("results", results);

<<<<<<< Updated upstream
    return NextResponse.json({ results }, { status: 200 });
=======
        const judgeCompletion = await openaiClient.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: judgePrompt },
            {
              role: "user",
              content: output || "This model did not generate a response.",
            },
          ],
        });

        let judgment;
        try {
          if (judgeCompletion.choices[0].message.content) {
            judgment = JSON.parse(judgeCompletion.choices[0].message.content);
          }
        } catch (error) {
          console.error("Error parsing judge's response:", error);
          judgment = {
            relevance: 0,
            accuracy: 0,
            completeness: 0,
            explanation: "Failed to parse the evaluation response.",
          };
        }

        return {
          model,
          output,
          scores: {
            relevance: judgment.relevance,
            accuracy: judgment.accuracy,
            completeness: judgment.completeness,
          },
          explanation: judgment.explanation,
        };
      })
    );

    return NextResponse.json(judgedResults, { status: 200 });
>>>>>>> Stashed changes
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
