import { executeStoredProc, saveToMongoDB } from '@/lib/dbUtils';
import type { NextApiRequest, NextApiResponse } from 'next';

const procedures = [
  { name: '__ClientsInvoiceReport_to_JSON', collection: 'invoices' },
  { name: '__Empty_Containers_to_JSON', collection: 'emptyContainers' },
  { name: '__Job_Status_to_JSON', collection: 'jobStatus' },
  { name: '__Total_Profit_to_JSON', collection: 'profitReports' }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const results = [];
    
    for (const proc of procedures) {
      try {
        const data = await executeStoredProc(proc.name);
        await saveToMongoDB(proc.collection, data);
        results.push({
          procedure: proc.name,
          count: data.length,
          status: 'success'
        });
      } catch (error) {
        results.push({
          procedure: proc.name,
          error: error instanceof Error ? error.message : String(error),
          status: 'failed'
        });
      }
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error('Sync all error:', error);
    res.status(500).json({ 
      message: 'Error in sync process', 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}