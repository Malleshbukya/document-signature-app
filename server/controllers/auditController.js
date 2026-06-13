const db =
  require("../db/database");

const getAuditLogs =
  (
    req,
    res
  ) => {

    try {

      const logs =
        db.prepare(`
          SELECT *
          FROM audit_logs
          WHERE file_id = ?
          ORDER BY created_at DESC
        `).all(
          req.params.fileId
        );

      res.json(logs);

    } catch (error) {

      res.status(500).json({
        error:
          error.message,
      });

    }

  };

module.exports = {
  getAuditLogs,
};