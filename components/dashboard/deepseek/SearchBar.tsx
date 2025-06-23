// components/SearchBar.tsx
'use client';

import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const res = await fetch('/api/deepseek', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: query }),
    });

    const data = await res.json();
    setResult(data.response);
    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          className="border p-2 w-full"
          disabled={loading}
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Search'}
        </button>
      </form>

      {result && (
        <div className="bg-gray-100 p-4 rounded mt-2">
          <strong>Answer:</strong> {result}
        </div>
      )}
    </div>
  );
}