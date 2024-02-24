import { MongoClient } from 'mongodb';

let MONGO_URI = 'mongodb://127.0.0.1/memories'; //mongodb+srv://suryanand:nl8T8EhYo8dfqT5l@admin-portal.wkhkoro.mongodb.net/cms?authSource=admin;

export const client = new MongoClient(MONGO_URI);
export const db = client.db();