import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'foodlab';

let clientPromise;

if (!uri) {
    console.warn('MONGODB_URI not set — Mongo features disabled');
}

if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise && uri) {
        global._mongoClientPromise = new MongoClient(uri).connect();
    }
    clientPromise = global._mongoClientPromise;
} else if (uri) {
    clientPromise = new MongoClient(uri).connect();
}

export async function getDb() {
    if (!clientPromise) throw new Error('MONGODB_URI missing');
    const client = await clientPromise;
    return client.db(dbName);
}

export async function getCollection(name) {
    const db = await getDb();
    return db.collection(name);
}
