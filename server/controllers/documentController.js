const db = require("../db/database");

const uploadDocument = (req, res) => {
  try {
    console.log("USER ID:", req.user?.id);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const file = req.file;

    const filePath = `uploads/${file.filename}`;

    const result = db.prepare(`
      INSERT INTO documents
      (
        owner_id,
        file_name,
        file_path,
        status
      )
      VALUES (?,?,?,?)
    `).run(
      req.user.id,
      file.originalname,
      filePath,
      "Pending"
    );

    console.log(
      "DOCUMENT INSERTED:",
      result
    );

    db.prepare(`
      INSERT INTO audit_logs
      (
        file_id,
        user_id,
        ip_address,
        action
      )
      VALUES (?,?,?,?)
    `).run(
      result.lastInsertRowid,
      req.user.id,
      req.ip,
      "Document Uploaded"
    );

    console.log(
      "AUDIT INSERTED"
    );

    res.status(201).json({
      message:
        "Document uploaded successfully",
      file: {
        id:
          result.lastInsertRowid,
        file_name:
          file.originalname,
        file_path:
          filePath,
      },
    });

  } catch (error) {

    console.log(
      "UPLOAD ERROR:",
      error
    );

    res.status(500).json({
      error:
        error.message,
    });

  }
};

const getDocuments = (
  req,
  res
) => {

  try {

    const documents =
      db.prepare(`
        SELECT *
        FROM documents
        WHERE owner_id = ?
      `).all(
        req.user.id
      );

    res.json(
      documents
    );

  } catch (error) {

    res.status(500).json({
      error:
        error.message,
    });

  }

};

const getDocumentById = (
  req,
  res
) => {

  try {

    const document =
      db.prepare(`
        SELECT *
        FROM documents
        WHERE id = ?
        AND owner_id = ?
      `).get(
        req.params.id,
        req.user.id
      );

    if (!document) {

      return res.status(404).json({
        message:
          "Document not found",
      });

    }

    res.json(
      document
    );

  } catch (error) {

    res.status(500).json({
      error:
        error.message,
    });

  }

};

const deleteDocument = (
  req,
  res
) => {

  try {

    db.prepare(`
      INSERT INTO audit_logs
      (
        file_id,
        user_id,
        ip_address,
        action
      )
      VALUES (?,?,?,?)
    `).run(
      req.params.id,
      req.user.id,
      req.ip,
      "Document Deleted"
    );

    db.prepare(`
      DELETE FROM signatures
      WHERE document_id = ?
    `).run(
      req.params.id
    );

    const result =
      db.prepare(`
        DELETE FROM documents
        WHERE id = ?
        AND owner_id = ?
      `).run(
        req.params.id,
        req.user.id
      );

    if (
      result.changes === 0
    ) {

      return res.status(404).json({
        message:
          "Document not found",
      });

    }

    res.json({
      message:
        "Document deleted successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error:
        error.message,
    });

  }

};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};