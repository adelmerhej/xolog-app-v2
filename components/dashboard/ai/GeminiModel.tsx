/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

// src/components/GeminiExample.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button" // Assumed path, adjust as necessary
//import { Input } from "@/components/ui/input"   // Assumed path, adjust as necessary
import { Textarea } from "@/components/ui/textarea" //Assumed path

const GeminiModel = () => {
    const searchParams = useSearchParams();
    const initialPrompt = searchParams.get("prompt") || "";
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    // Auto-generate if prompt is present in URL
    useEffect(() => {
        if (initialPrompt) {
            setPrompt(initialPrompt); // Ensure prompt is set
            handleSubmit();           // Trigger generation
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialPrompt]);

 const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!prompt.trim()) return;
        setLoading(true);
        setResponse('');
        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch response');
            }
            const data = await res.json();
            setResponse(data.output);
        } catch (error: any) {
            setResponse(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

  return (
        <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold">Generate Text with Gemini</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="prompt" className="block text-sm font-medium">Prompt:</label>

                    <Textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt here..."
                        className="w-full"
                        rows={4}
                        disabled={loading}
                    />

                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="submit" disabled={loading} className="w-auto">
                      {loading ? 'Loading...' : 'Generate Text'}
                  </Button>
                </div>
            </form>
            {response && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Response:</h3>
                    <p className="whitespace-pre-wrap border p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                        {response}
                    </p>
                </div>
            )}
        </div>
    );
};

export default GeminiModel;