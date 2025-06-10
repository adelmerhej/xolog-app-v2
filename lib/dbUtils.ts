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
    trustServerCertificate: true // For local dev
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
  if (!process.env.SQL_USER || !process.env.SQL_PASSWORD || !process.env.SQL_SERVER || !process.env.SQL_DATABASE) {
    throw new Error('Missing required SQL Server environment variables');
  }
  let pool: ConnectionPool | null = null;
  try {
    pool = await new ConnectionPool(sqlConfig).connect();
    const request = pool.request();
    
    // Add parameters dynamically
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value);
    }
    
    const result = await request.query(`EXEC ${procedureName} FOR JSON PATH`);
    return JSON.parse(result.recordset[0][""]); 
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