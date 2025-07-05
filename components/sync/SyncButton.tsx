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
      console.log("Syncing...", new Date().toLocaleTimeString());
      
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
      
      console.log("Synced", new Date().toLocaleTimeString());

    } catch (err: unknown) {
        console.log("This error: ", err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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
        <div className="bg-green-200 p-2 rounded">
          <h4>Sync Results: {syncResult.success ? 'Failed' : 'Success'}</h4>
        </div>
      )}
    </div>
  );
}