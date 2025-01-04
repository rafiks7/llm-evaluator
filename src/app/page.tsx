"use client";

import React, { useState } from "react";

export default function Home() {
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [userMessage, setUserMessage] = useState("");
<<<<<<< Updated upstream
=======
  const [isLoading, setIsLoading] = useState(false);
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const [isContainerVisible, setIsContainerVisible] = useState(false);
>>>>>>> Stashed changes
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsResultsVisible(true);
    }, 500);

    const containerTimer = setTimeout(() => {
      setIsContainerVisible(true);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearTimeout(containerTimer);
    };
  }, []);

  return (
<<<<<<< Updated upstream
    <div className="min-h-screen flex flex-col items-center bg-teal-600 p-6">
      <h1 className="text-2xl font-bold text-amber-400 mb-4">LLM Evaluation</h1>

      <div className="w-full max-w-lg bg-white p-6 rounded shadow-md border border-teal-200">
        <div className="mb-4">
          <label className="block text-teal-800 font-medium mb-2">
=======
    <div className="min-h-screen flex-w bg-gradient-to-r from-teal-500 to-cyan-500 p-4">
      <h1 className="text-2xl text-center font-extrabold text-white mb-6">
        LLM Evaluation
      </h1>
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg border border-teal-200 mx-auto">
        <div className="mb-6">
          <label className="block text-teal-800 font-semibold mb-2 text-sm">
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      <div className="w-full mt-8">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-amber-500 mb-4">Results</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(({ model, output, score }, index) => (
              <div
                key={index}
                className="border border-teal-300 rounded p-4 text-black bg-gray-50 overflow-hidden"
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
=======
      {isLoading ? (
        <div className="flex items-center justify-center min-w-screen min-h-screen bg-gradient-to-r from-teal-500 to-cyan-500">
          <div className=" justify-center w-24 h-24 mt-0 border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="mt-8 w-full max-w-screen items-center justify-center flex flex-col gap-8">
          {results.length > 0 && isResultsVisible && (
            <h2 className="text-2xl font-semibold text-white mt-6 animate-fadeIn">
              Results
            </h2>
          )}

          {isContainerVisible && (
            <div className="justify-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
                    className={`border-2 border-teal-300 rounded-lg p-6 text-white bg-teal-950 shadow-md hover:shadow-xl transition-all duration-300 animate-fadeIn`}
                    style={{
                      animationDelay: `${isContainerVisible ? index * 0.3 : 0}s`,
                    }} // Delay per item
                  >
                    <div className="flex justify-center items-center space-x-3 mb-3">
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
                      <p className="font-bold text-amber-400 text-sm">
                        Scores:
                      </p>
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
          )}
>>>>>>> Stashed changes
        </div>
      </div>
    </div>
  );
}
