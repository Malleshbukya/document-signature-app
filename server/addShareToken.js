const db = require("./db/database");

try {
  db.exec(`
    ALTER TABLE documents
    ADD COLUMN share_token TEXT
  `);

  console.log(
    "share_token column added successfully"
  );
} catch (error) {
  console.log(error.message);
}