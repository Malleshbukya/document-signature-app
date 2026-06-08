const express = require("express");

const upload = require(
  "../middleware/uploadMiddleware"
);

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  uploadDocument,
  getDocuments,
  getDocumentById,
} = require(
  "../controllers/documentController"
);

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  uploadDocument
);

router.get(
  "/",
  authMiddleware,
  getDocuments
);

router.get(
  "/:id",
  authMiddleware,
  getDocumentById
);

module.exports = router;