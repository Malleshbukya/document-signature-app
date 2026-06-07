const express =
  require("express");

const upload =
  require(
    "../middleware/uploadMiddleware"
  );

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  uploadDocument,
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

module.exports =
  router;