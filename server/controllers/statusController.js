const db =
  require("../db/database");

const updateStatus =
  (req, res) => {

    try {

      const {
        documentId,
        status,
        reason,
      } = req.body;

      db.prepare(`
        UPDATE documents
        SET
          status = ?,
          rejection_reason = ?
        WHERE id = ?
      `).run(
        status,
        reason || null,
        documentId
      );

      res.json({
        message:
          "Status updated successfully",
      });

    } catch (error) {

      res.status(500).json({
        error:
          error.message,
      });

    }

  };

const getStatus =
  (req, res) => {

    try {

      const document =
        db.prepare(`
          SELECT
            id,
            file_name,
            status,
            rejection_reason
          FROM documents
          WHERE id = ?
        `).get(
          req.params.id
        );

      res.json(document);

    } catch (error) {

      res.status(500).json({
        error:
          error.message,
      });

    }

  };

module.exports = {
  updateStatus,
  getStatus,
};