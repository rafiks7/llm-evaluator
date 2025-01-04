import { NextResponse } from "next/server";
import OpenAI from "openai";

import Groq from "groq-sdk";

const groqClient = new Groq({
  apiKey: process.env["GROQ_API_KEY"],
});

const openaiClient = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
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

    // Simulate responses for each selected model
    const generatedResponses = await Promise.all(
      selectedModels.map(async (model) => {
        const chatCompletion = await groqClient.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          model: model,
        });

        const response = chatCompletion.choices[0].message.content;

        return {
          model,
          output: response,
        };
      })
    );

    // Judge responses using the "judge" LLM with scoring metrics
    const judgedResults = await Promise.all(
      generatedResponses.map(async ({ model, output }) => {
        const judgePrompt = `
          You are tasked with evaluating the quality of the following response based on the following criteria:
          1. **Relevance**: How well does the response address the user's message?
          2. **Accuracy**: Are the facts or information provided correct?
          3. **Completeness**: Does the response cover all aspects of the question?
          
          Please provide your evaluation in the following JSON format:
          {
            "relevance": <score from 1 to 10>,
            "accuracy": <score from 1 to 10>,
            "completeness": <score from 1 to 10>,
            "explanation": "<brief explanation of your scoring>"
          }
          
          ---
          
          **User Message**: 
          "${userMessage}"
          
          **Response from the model "${model}":**
          "${output}"
          
          **Your JSON Evaluation**:
          `;

        const judgeCompletion = await openaiClient.chat.completions.create({
          model: "gpt-4o-mini",
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
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
