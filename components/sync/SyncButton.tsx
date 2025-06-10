/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

export default function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);

    try {
      const response = await fetch('/api/sync/reports/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setSyncResult(result);

    } catch (err) {
        console.log("This error: ", err);

        setError(err.message);
    } finally {
        setIsSyncing(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleSync} 
        disabled={isSyncing}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded"
      >
        {isSyncing ? 'Syncing...' : 'Sync Data'}
      </button>

      {error && (
        <div className="text-red-500">
          Error: {error}
        </div>
      )}

      {syncResult && !error && (
        <div className="bg-gray-200 p-2 rounded">
          <h4>Sync Results:</h4>
          <ul>
            {syncResult.results.map((item: any, index: number) => (
              <li key={index}>
                {item.procedure}: {item.status} - {item.count || item.error}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}