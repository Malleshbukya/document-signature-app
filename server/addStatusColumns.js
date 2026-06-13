const db = require("./db/database");

try {
  db.exec(`
    ALTER TABLE documents
    ADD COLUMN status TEXT
    DEFAULT 'Pending'
  `);

  console.log("status column added");
} catch (err) {
  console.log("status already exists");
}

try {
  db.exec(`
    ALTER TABLE documents
    ADD COLUMN rejection_reason TEXT
  `);

  console.log(
    "rejection_reason column added"
  );
} catch (err) {
  console.log(
    "rejection_reason already exists"
  );
}