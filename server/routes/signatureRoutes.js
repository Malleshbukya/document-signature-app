const express =
  require("express");

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  saveSignature,
  getSignatures,
  getLatestSignature,
} = require(
  "../controllers/signatureController"
);

const logAudit =
  require(
    "../middleware/auditMiddleware"
  );

const router =
  express.Router();

// Save Signature

router.post(
  "/",
  authMiddleware,
  logAudit(
    "SIGNED_DOCUMENT"
  ),
  saveSignature
);

// Get Latest Uploaded Signature

router.get(
  "/latest",
  getLatestSignature
);

// Get Signatures By Document ID

router.get(
  "/:id",
  authMiddleware,
  getSignatures
);

module.exports =
  router;