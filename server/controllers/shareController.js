const db = require("../db/database");
const { v4: uuidv4 } = require("uuid");

const generateLink = (req, res) => {
  try {
    const token = uuidv4();

    db.prepare(`
      UPDATE documents
      SET share_token = ?
      WHERE id = ?
    `).run(
      token,
      req.params.id
    );

    res.json({
      token,
      url: `http://localhost:5173/sign/${token}`,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

const getDocumentByToken = (
  req,
  res
) => {
  try {

    const { token } =
      req.params;

    const document =
      db.prepare(`
        SELECT *
        FROM documents
        WHERE share_token = ?
      `).get(token);

    if (!document) {
      return res
        .status(404)
        .json({
          message:
            "Invalid token",
        });
    }

    res.json(document);

  } catch (error) {

    res.status(500).json({
      error:
        error.message,
    });

  }
};

module.exports = {
  generateLink,
  getDocumentByToken,
};