const db = require("../db/database");

const uploadDocument = (
  req,
  res
) => {

  try {

    const file =
      req.file;

    const result =
      db.prepare(`
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
        file.path,
        "Pending"
      );

    // Audit Log

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

    res.status(201).json({
      message:
        "Document uploaded successfully",
      file,
    });

  } catch (error) {

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
      db
        .prepare(`
          SELECT *
          FROM documents
          WHERE owner_id = ?
        `)
        .all(
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
      db
        .prepare(`
          SELECT *
          FROM documents
          WHERE id = ?
          AND owner_id = ?
        `)
        .get(
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

    // Audit before delete

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

    // Delete signatures

    db.prepare(`
      DELETE FROM signatures
      WHERE document_id = ?
    `).run(req.params.id);

    // Delete document

    const result =
      db.prepare(`
        DELETE FROM documents
        WHERE id = ?
        AND owner_id = ?
      `)
      .run(
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