/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React from 'react';
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from 'remark-gfm';
//import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// Choose a style that fits your theme
//import { coldarkDark, coldarkCold } from 'react-syntax-highlighter/dist/esm/styles/prism';
//import type { CodeProps } from 'react-markdown/lib/ast-to-react';

interface CodeProps {
    node?: any,
    inline?: any,
    className?: any,
    children?: any,
}

interface AiResponseDisplayProps {
  response: string;
  loading: boolean;
  error: string | null;
}

const AiResponseDisplay: React.FC<AiResponseDisplayProps> = ({ response, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md text-gray-700 dark:text-gray-300 animate-pulse">
        <p>Thinking...</p>
        {/* You could add a simple loading spinner here */}
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mt-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mt-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900 p-6 rounded-lg shadow-md text-red-700 dark:text-red-300">
        <p className="font-semibold mb-2">Error generating response:</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!response) {
    return null; // Or a placeholder message
  }

  // Determine light/dark mode for syntax highlighter theme
  const isDarkMode = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const codeStyle = isDarkMode ? "dark" : "light";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 max-w-full overflow-auto">
      <div className="prose dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }: CodeProps) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline ? (
                <pre
                  style={codeStyle as any} // Type assertion to fix the style type issue
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </pre>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {response}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default AiResponseDisplay;