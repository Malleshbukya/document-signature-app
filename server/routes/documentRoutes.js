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
  deleteDocument,
} = require(
  "../controllers/documentController"
);

const router =
  express.Router();

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

router.delete(
  "/:id",
  authMiddleware,
  deleteDocument
);

router.get(
  "/:id",
  authMiddleware,
  getDocumentById
);

module.exports =
  router;