import { executeStoredProc, saveToMongoDB, updateJobStatuses } from '@/lib/dbUtils';
import { sqlConfig, mongoConfig } from '@/lib/dbUtils';
import { NextResponse } from 'next/server';

const procedures = [
  { name: '__ClientsInvoiceReport_to_JSON', collection: 'ClientsInvoiceReport' },
  { name: '__Empty_Containers_to_JSON', collection: 'emptycontainers' },
  { name: '__Total_Profit_to_JSON', collection: 'totalprofits' },
  { name: '__Job_Status_to_JSON', collection: 'jobstatus' }
];

// Validate collection names
const validCollections = new Set(['ClientsInvoiceReport', 'emptycontainers', 'totalprofits', 'jobstatus']);
//const validCollections = new Set(['totalprofits']);

for (const proc of procedures) {
  if (!validCollections.has(proc.collection)) {
    throw new Error(`Invalid collection name: ${proc.collection}`);
  }
}

export async function POST() {
  try {
    console.log("Syncing...", new Date().toLocaleTimeString());
    const results = [];
    
    for (const proc of procedures) {
      try {
        const data = await executeStoredProc(proc.name);
        await saveToMongoDB(proc.collection, data);

        // results.push({
        //   procedure: proc.name,
        //   count: data.length,
        //   status: 'success'
        // });
        //console.log(`Synced ${proc.name} to MongoDB`);
      } catch (error) {
        results.push({
          procedure: proc.name,
          error: error instanceof Error ? error.message : String(error),
          status: 'failed'
        });
      }
    }

    // Update job statuses after sync
    await updateJobStatuses();
    
    console.log("Synced", new Date().toLocaleTimeString());
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Sync all error:', error);
    console.error('Sync all error:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { 
        message: 'Error in sync process', 
        error: error instanceof Error ? error.message : String(error),
        details: {
          sqlConfig: {
            user: sqlConfig.user ? '***' : 'not set',
            server: sqlConfig.server,
            database: sqlConfig.database
          },
          mongoConfig: {
            uri: mongoConfig.uri ? '***' : 'not set',
            dbName: mongoConfig.dbName
          }
        }
      },
      { status: 500 }
    );
  }
}
