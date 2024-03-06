"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.client = void 0;
const mongodb_1 = require("mongodb");
let password = 'Jatov007'; // Replace with your actual password
let encodedPassword = encodeURIComponent(password);
// let MONGO_URI = 'mongodb://127.0.0.1/memories'; //mongodb+srv://suryanand:nl8T8EhYo8dfqT5l@admin-portal.wkhkoro.mongodb.net/cms?authSource=admin;
let MONGO_URI = `mongodb+srv://jatovdeepak:${encodedPassword}@cluster0.rrkpuay.mongodb.net/`;
// let MONGO_URI = 'mongodb+srv://myAtlasDBUser:ankitkumar12112@myatlasclusteredu.8yuh5dc.mongodb.net/'
exports.client = new mongodb_1.MongoClient(MONGO_URI);
exports.db = exports.client.db();
//# sourceMappingURL=db.js.map