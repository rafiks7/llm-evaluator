"use client";

import React, { useState } from "react";

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [output, setOutput] = useState("");
  const [score, setScore] = useState<number | null>(null);

  const handleEvaluate = async () => {
    try {
      const payload = {
        systemPrompt,
        selectedModels,
        userMessage,
      };

      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      setOutput(data.output);
      setScore(data.score);
    } catch (error) {
      console.error("Failed to evaluate:", error);
      setOutput("Error occurred while evaluating.");
      setScore(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-teal-600 p-6">
      <h1 className="text-2xl font-bold text-amber-400 mb-4">LLM Evaluation</h1>

      <div className="w-full max-w-lg bg-white p-6 rounded shadow-md border border-teal-200">
        <div className="mb-4">
          <label className="block text-teal-800 font-medium mb-2">
            System Prompt
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter the system prompt"
            className="w-full border-teal-300 rounded text-black px-3 py-2 focus:ring focus:ring-amber-300"
          />
        </div>

        <div className="mb-4">
          <label className="block text-teal-800 font-medium mb-2">
            Select Model
          </label>
          <select
            multiple
            value={selectedModels}
            onChange={(e) =>
              setSelectedModels(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
            className="w-full border-teal-300 text-black rounded px-3 py-2 focus:ring focus:ring-amber-300"
          >
            <option value="gemma2-9b-it">gemma2-9b-it</option>
            <option value="llama-3.3-70b-versatile">
              llama-3.3-70b-versatile
            </option>
            <option value="llama-3.1-8b-instant">llama-3.1-8b-instant</option>
            <option value="llama3-8b-8192">llama3-8b-8192</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-teal-800 font-medium mb-2">
            User Test Message
          </label>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Enter test message"
            className="w-full border-teal-300 text-black rounded px-3 py-2 focus:ring focus:ring-amber-300"
          />
        </div>

        <button
          onClick={handleEvaluate}
          className="w-full bg-amber-500 text-white py-2 rounded hover:bg-amber-600 transition"
        >
          Evaluate
        </button>
      </div>

      {output && (
        <div className="w-full max-w-lg mt-6 bg-white p-6 rounded shadow-md border border-teal-200">
          <h2 className="text-lg font-bold text-teal-700 mb-2">Output</h2>
          <p className="text-black">{output}</p>
          <h3 className="text-lg font-bold text-teal-700 mt-4">Score</h3>
          <p className="text-black">{score}</p>
        </div>
      )}
    </div>
  );
}
