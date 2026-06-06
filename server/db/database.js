const Database = require("better-sqlite3");

const db = new Database("document_signature.db");

module.exports = db;