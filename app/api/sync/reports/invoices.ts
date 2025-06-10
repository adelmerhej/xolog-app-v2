import { executeStoredProc, saveToMongoDB } from '@/lib/dbUtils';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Execute the stored procedure with parameters
    const invoiceData = await executeStoredProc('__ClientsInvoiceReport_to_JSON', {
      DateFrom: req.body.dateFrom || null,
      DateTo: req.body.dateTo || null,
      UserId: req.body.userId || 0,
      // Add other parameters as needed
    });

    // Save to MongoDB
    await saveToMongoDB('invoices', invoiceData);

    res.status(200).json({ message: 'Data synced successfully', count: invoiceData.length });
  } catch (error: unknown) {
    console.error('Sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({ message: 'Error syncing data', error: errorMessage });
  }
}