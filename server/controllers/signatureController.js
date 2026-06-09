const db =
  require("../db/database");

const saveSignature =
  (req, res) => {

    try {

      const {
        documentId,
        x,
        y,
        page,
      } = req.body;

      const result =
        db.prepare(`
          INSERT INTO signatures
          (
            document_id,
            user_id,
            x,
            y,
            page
          )
          VALUES (?,?,?,?,?)
        `).run(
          documentId,
          req.user.id,
          x,
          y,
          page || 1
        );

      res.status(201).json({
        message:
          "Signature saved",
        id:
          result.lastInsertRowid,
      });

    } catch (error) {

      res.status(500).json({
        error:
          error.message,
      });

    }
};

const getSignatures = (req, res) => {
  try {
    const signatures = db
      .prepare(`
        SELECT *
        FROM signatures
        WHERE document_id = ?
      `)
      .all(req.params.id);

    res.json(signatures);

  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  saveSignature,
  getSignatures,
};