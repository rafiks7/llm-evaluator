"use client";

import React, { useEffect, useState } from "react";

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<
    {
      model: string;
      output: string;
      scores: {
        relevance: number;
        accuracy: number;
        completeness: number;
      };
      explanation: string;
    }[]
  >([]);

  const handleEvaluate = async () => {
    try {
      const payload = {
        systemPrompt,
        selectedModels,
        userMessage,
      };

      setIsLoading(true);
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

      setResults(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to evaluate:", error);
      setResults([
        {
          model: "Error",
          output: "Error occurred while evaluating.",
          scores: {
            relevance: 0,
            accuracy: 0,
            completeness: 0,
          },
          explanation: "Failed to evaluate the models.",
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-teal-500 to-cyan-500 p-4">
      <h1 className="text-2xl font-extrabold text-white mb-6">
        LLM Evaluation
      </h1>

      <div className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg border border-teal-200">
        <div className="mb-6">
          <label className="block text-teal-800 font-semibold mb-2 text-sm">
            System Prompt
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            placeholder="Enter the system prompt"
            className="w-full border-2 border-teal-300 rounded-lg text-black px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition duration-200"
          />
        </div>

        <div className="mb-6">
          <label className="block text-teal-800 font-semibold mb-2 text-sm">
            Select Model(s)
          </label>
          <div className="space-y-3 grid grid-cols-2">
            {[
              "gemma2-9b-it",
              "llama-3.3-70b-versatile",
              "llama-3.1-8b-instant",
              "llama3-70b-8192",
              "llama3-8b-8192",
              "mixtral-8x7b-32768",
            ].map((model) => (
              <label
                key={model}
                className="flex items-center space-x-2 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  value={model}
                  checked={selectedModels.includes(model)}
                  onChange={(e) => {
                    const newSelectedModels = e.target.checked
                      ? selectedModels.length < 3
                        ? [...selectedModels, model]
                        : selectedModels
                      : selectedModels.filter((item) => item !== model);
                    setSelectedModels(newSelectedModels);
                  }}
                  className="h-4 w-4 border-2 border-teal-300 rounded-lg focus:ring-2 focus:ring-amber-500 transition duration-150"
                  disabled={
                    selectedModels.length >= 3 &&
                    !selectedModels.includes(model)
                  }
                />
                <span className="text-teal-800 font-medium">{model}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-teal-800 font-semibold mb-2 text-sm">
            User Test Message
          </label>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Enter test message"
            disabled={isLoading}
            className="w-full border-2 border-teal-300 rounded-lg text-black px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-400 transition duration-200"
          />
        </div>

        <button
          onClick={handleEvaluate}
          className="w-full bg-amber-500 text-white py-2 rounded-lg hover:bg-amber-600 transition duration-200 flex justify-center items-center text-sm"
        >
          {isLoading ? "Evaluating..." : "Evaluate"}
        </button>
      </div>

      {isLoading ? (
        <div className="w-24 h-24 mt-20 border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      ) : (
        <div className="mt-8 w-full max-w-7xl flex flex-col gap-8">
          {results.length > 0 && (
            <h2 className="text-2xl font-semibold text-white mt-6 text-center">
              Results
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map(({ model, output, scores, explanation }, index) => {
              let modelColor;
              switch (model) {
                case "gemma2-9b-it":
                  modelColor = "blue-600";
                  break;
                case "llama-3.3-70b-versatile":
                  modelColor = "lime-600";
                  break;
                case "llama3-70b-8192":
                  modelColor = "rose-600";
                  break;
                case "llama-3.1-8b-instant":
                  modelColor = "yellow-600";
                  break;
                case "llama3-8b-8192":
                  modelColor = "purple-600";
                  break;
                default:
                  modelColor = "teal-600";
              }

              const getScoreColor = (score: number) => {
                if (score >= 6) return "text-green-500";
                if (score >= 3) return "text-yellow-500";
                return "text-red-500";
              };

              return (
                <div
                  key={index}
                  className="border-2 border-teal-300 rounded-lg p-6 text-white bg-teal-950 shadow-md hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <p
                      className={`text-sm text-${modelColor} border-2 border-amber-400 rounded-full px-3 py-1`}
                    >
                      {model}
                    </p>
                  </div>

                  <p className="font-bold text-amber-400 mt-2 text-sm">
                    Output:
                  </p>
                  <div className="max-h-36 overflow-y-auto text-sm">
                    <p>{output}</p>
                  </div>

                  <div className="mt-4">
                    <p className="font-bold text-amber-400 text-sm">Scores:</p>
                    <ul className="ml-4 list-disc text-sm">
                      <li className={getScoreColor(scores.relevance)}>
                        <strong>Relevance:</strong> {scores.relevance}
                      </li>
                      <li className={getScoreColor(scores.accuracy)}>
                        <strong>Accuracy:</strong> {scores.accuracy}
                      </li>
                      <li className={getScoreColor(scores.completeness)}>
                        <strong>Completeness:</strong> {scores.completeness}
                      </li>
                    </ul>
                  </div>

                  <p className="mt-4 font-bold text-amber-400 text-sm">
                    Explanation:
                  </p>
                  <div className="max-h-36 overflow-y-auto text-sm">
                    <p>{explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
