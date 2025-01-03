"use client";

import React, { useState } from "react";

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [results, setResults] = useState<
    { model: string; output: string; score: number }[]
  >([]);

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

      setResults(data.results);
    } catch (error) {
      console.error("Failed to evaluate:", error);
      setResults([
        {
          model: "Error",
          output: "Error occurred while evaluating.",
          score: 0,
        },
      ]);
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

      <div className="mt-8">
        <h2 className="text-xl font-bold text-amber-500 mb-4">Results</h2>
        <div className="flex flex-wrap gap-4">
          {results.map(({ model, output, score }, index) => (
            <div
              key={index}
              className="border border-teal-300 rounded p-4 text-black bg-gray-50 flex-1 min-w-[250px] max-w-[500px]" // Adapts to content width, with min and max width
            >
              <p>
                <strong>Model:</strong> {model}
              </p>
              <p>
                <strong>Output:</strong> {output}
              </p>
              <p>
                <strong>Score:</strong> {score}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
