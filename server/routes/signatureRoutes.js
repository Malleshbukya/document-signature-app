const express =
  require("express");

const authMiddleware =
  require(
    "../middleware/authMiddleware"
  );

const {
  saveSignature,
  getSignatures,
} = require(
  "../controllers/signatureController"
);

const router =
  express.Router();

// Save Signature
router.post(
  "/",
  authMiddleware,
  saveSignature
);

// Get Signatures By Document ID
router.get(
  "/:id",
  authMiddleware,
  getSignatures
);

module.exports =
  router;