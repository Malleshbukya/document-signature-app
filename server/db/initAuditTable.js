const db = require("./database");

db.exec(`
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file_id INTEGER NOT NULL,
  user_id INTEGER,
  ip_address TEXT,
  action TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

console.log("Audit table ready");