import { MongoClient } from 'mongodb';

// let password = 'Jatov007'; // Replace with your actual password
// let encodedPassword = encodeURIComponent(password);


// let MONGO_URI = `mongodb+srv://jatovdeepak:${encodedPassword}@cluster0.rrkpuay.mongodb.net/`;

let MONGO_URI = 'mongodb://127.0.0.1/memories';


export const client = new MongoClient(MONGO_URI);
export const db = client.db();
