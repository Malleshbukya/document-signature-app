const db =
  require("../db/database");

const logAudit =
  (action) =>
  (
    req,
    res,
    next
  ) => {

    req.logAudit =
      (
        fileId,
        userId
      ) => {

        db.prepare(`
          INSERT INTO audit_logs
          (
            file_id,
            user_id,
            ip_address,
            action
          )
          VALUES
          (?, ?, ?, ?)
        `).run(
          fileId,
          userId,
          req.ip,
          action
        );

      };

    next();
  };

module.exports =
  logAudit;