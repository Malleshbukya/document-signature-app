const db =
  require("../db/database");

const fs =
  require("fs");

const path =
  require("path");

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

      req.logAudit(
        documentId,
        req.user.id
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

const getSignatures =
  (req, res) => {

    try {

      const signatures =
        db.prepare(`
          SELECT *
          FROM signatures
          WHERE document_id = ?
        `).all(
          req.params.id
        );

      res.json(
        signatures
      );

    } catch (error) {

      res.status(500).json({
        error:
          error.message,
      });

    }

  };

const getLatestSignature =
  (req, res) => {

    try {

      const signaturesDir =
        path.join(
          __dirname,
          "../uploads/signatures"
        );

      const files =
        fs.readdirSync(
          signaturesDir
        );

      if (
        files.length === 0
      ) {

        return res.status(404).json({
          message:
            "No signatures found",
        });

      }

      const latestFile =
        files.sort().pop();

      res.json({
        path:
          `uploads/signatures/${latestFile}`,
      });

    } catch (error) {

      res.status(500).json({
        error:
          error.message,
      });

    }

  };

module.exports = {
  saveSignature,
  getSignatures,
  getLatestSignature,
};