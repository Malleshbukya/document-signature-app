const express =
  require("express");

const multer =
  require("multer");

const path =
  require("path");

const fs =
  require("fs");

const router =
  express.Router();

// Create uploads/signatures folder if it doesn't exist
const signatureDir =
  path.join(
    __dirname,
    "../uploads/signatures"
  );

if (
  !fs.existsSync(
    signatureDir
  )
) {
  fs.mkdirSync(
    signatureDir,
    {
      recursive: true,
    }
  );
}

const storage =
  multer.diskStorage({

    destination:
      (req, file, cb) => {

        cb(
          null,
          signatureDir
        );

      },

    filename:
      (req, file, cb) => {

        cb(
          null,
          Date.now() +
          path.extname(
            file.originalname
          )
        );

      }

  });

const upload =
  multer({
    storage
  });

router.post(
  "/",
  upload.single(
    "signature"
  ),
  (req, res) => {

    res.json({
      file:
        req.file.path
    });

  }
);

module.exports =
  router;