"use client";

import { useCallback, useState } from "react";
import AiResponseDisplay from "../components/AiResponseDisplay";
import { Button } from "./ui/button";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setResponse(""); // Clear previous response

      try {
        const res = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Something went wrong");
        }

        // Read the streamed response
        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = "";

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;
          accumulatedResponse += decoder.decode(value, { stream: true });
          setResponse(accumulatedResponse); // Update state with each chunk
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    [prompt]
  ); // Re-create handleSubmit if prompt changes

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-xl font-bold">What can I help with?</h3>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-2">
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm
           focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          rows={2}
          placeholder="Ask me anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
        />
        <div className="flex gap-2 justify-end">
          <Button type="submit" disabled={loading} className="w-auto">
            {loading ? "Loading..." : "Send Prompt"}
          </Button>
        </div>
      </form>

      <AiResponseDisplay response={response} loading={loading} error={error} />
    </div>
  );
}
