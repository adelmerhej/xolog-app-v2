/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongoClient } from 'mongodb';
import { ConnectionPool } from 'mssql';

// SQL Server Configuration
export const sqlConfig: { user: string; password: string; server: string; database: string; options: { encrypt: boolean; trustServerCertificate: boolean; } } = {
  user: process.env.SQL_USER || 'dbuser',
  password: process.env.SQL_PASSWORD || 'dbuser',
  server: process.env.SQL_HOST || 'localhost',
  database: process.env.SQL_DATABASE || 'master',
  options: {
    encrypt: true, // For Azure
    trustServerCertificate: true, // For local dev
    //connectionTimeout: 30000, // 30 seconds
    //requestTimeout: 60000 // 60 seconds
  }
};

// MongoDB Configuration
export const mongoConfig = {
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGODB_DB || 'xologdb'
};

const mongoClient = new MongoClient(mongoConfig.uri);
const dbName = mongoConfig.dbName;

// Execute SQL Stored Procedure and return JSON
async function executeStoredProc(procedureName: string, params: any = {}): Promise<any> {
  // Validate SQL configuration only during runtime
  if (!process.env.SQL_USER || !process.env.SQL_PASSWORD || !process.env.SQL_HOST || !process.env.SQL_DATABASE) {
    throw new Error('Missing required SQL Server environment variables');
  }

  let pool: ConnectionPool | null = null;
  try {
    console.log(`Connecting to SQL Server for procedure: ${procedureName}`);
    console.log(`SQL Server config:`, {
      user: sqlConfig.user ? '***' : 'not set',
      server: sqlConfig.server,
      database: sqlConfig.database
    });
    
    pool = await new ConnectionPool(sqlConfig).connect();
    
    console.log(`Connected to SQL Server. Executing procedure: ${procedureName}`);
    console.log(`Procedure parameters:`, params);
    
    const request = pool.request();
    
    // Add parameters dynamically
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
      console.log(`Added parameter: ${key} =`, value);
    }
    
    console.time(`SQL execution time for ${procedureName}`);
    const result = await request.query(`EXEC ${procedureName}`);
    console.timeEnd(`SQL execution time for ${procedureName}`);
    
    console.log(`SQL result object structure for ${procedureName}:`, {
      recordsets: result.recordsets?.length,
      recordset: result.recordset?.length,
      output: Object.keys(result.output || {}),
      rowsAffected: result.rowsAffected
    });
    
    console.log(`Raw SQL result from ${procedureName}:`, {
      recordsetSample: result.recordset?.slice(0, 1), // Show first record only
      output: result.output,
      rowsAffected: result.rowsAffected
    });
    
    const record = result.recordset?.[0];
    
    if (!record) {
      throw new Error(`No records returned from ${procedureName}`);
    }

    const jsonResult = record["" ];
    
    if (jsonResult === undefined || jsonResult === null) {
      throw new Error(`Procedure ${procedureName} returned undefined or null JSON`);
    }

    console.log(`JSON result from ${procedureName}:`, jsonResult);
    
    try {
      return JSON.parse(jsonResult);
    } catch (parseError) {
      console.error(`Failed to parse JSON from ${procedureName}:`, jsonResult);
      throw new Error(`Invalid JSON format from ${procedureName}: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    } 
  } finally {
    if (pool) await pool.close();
  }
}

// Save JSON data to MongoDB
async function saveToMongoDB(collectionName: string, data: any[]) {
  try {
    await mongoClient.connect();
    const db = mongoClient.db(dbName);
    const collection = db.collection(collectionName);
    
    // Insert or update documents
    const bulkOps = data.map(doc => ({
      updateOne: {
        filter: { _id: doc.JobNo || doc.InvoiceNo || doc.id }, 
        update: { $set: doc },
        upsert: true
      }
    }));
    
    if (bulkOps.length > 0) {
      await collection.bulkWrite(bulkOps);
    }
  } finally {
    await mongoClient.close();
  }
}

export { executeStoredProc, saveToMongoDB };