const db = require("./database");

db.exec(`
CREATE TABLE IF NOT EXISTS signatures (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  document_id INTEGER NOT NULL,

  user_id INTEGER NOT NULL,

  x REAL NOT NULL,

  y REAL NOT NULL,

  page INTEGER DEFAULT 1,

  status TEXT DEFAULT 'pending',

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(document_id)
    REFERENCES documents(id),

  FOREIGN KEY(user_id)
    REFERENCES users(id)
)
`);

console.log(
  "Signatures table ready"
);