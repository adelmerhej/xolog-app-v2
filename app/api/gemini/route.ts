// app/api/gemini/route.ts
import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Initialize the new GoogleGenAI client
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'models/gemini-2.5-flash-preview-04-17',
    });

    // Use sendMessageStream to get the async iterable
    const streamResult = await chat.sendMessageStream({ message: { text: prompt } }); // Fixed parameter structure

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        // Iterate directly over the streamResult (the AsyncGenerator)
        for await (const chunk of streamResult) { // <<<< CORRECTION HERE: changed from result.stream to streamResult
          const text = chunk.text; // Access the text property of the chunk
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      },
    });


    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/plain', // Or 'text/event-stream' for SSE
        'Cache-Control': 'no-cache, no-transform',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error("Error streaming Gemini API:", error);
    return new NextResponse(JSON.stringify({ error: "Failed to generate content" }), { status: 500 });
  }
}
