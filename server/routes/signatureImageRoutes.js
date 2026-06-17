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

// Upload folder path

const signatureDir =
  path.join(
    __dirname,
    "../uploads/signatures"
  );

console.log(
  "SIGNATURE DIR:",
  signatureDir
);

console.log(
  "EXISTS BEFORE:",
  fs.existsSync(
    signatureDir
  )
);

// Create folder if missing

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

  console.log(
    "SIGNATURE FOLDER CREATED"
  );
}

console.log(
  "EXISTS AFTER:",
  fs.existsSync(
    signatureDir
  )
);

// Multer Storage

const storage =
  multer.diskStorage({

    destination:
      (
        req,
        file,
        cb
      ) => {

        cb(
          null,
          signatureDir
        );

      },

    filename:
      (
        req,
        file,
        cb
      ) => {

        cb(
          null,
          Date.now() +
          path.extname(
            file.originalname
          )
        );

      },

  });

const upload =
  multer({
    storage,
  });

// Upload Route

router.post(
  "/",
  upload.single(
    "signature"
  ),
  (
    req,
    res
  ) => {

    console.log(
      "SIGNATURE UPLOADED:",
      req.file.path
    );

    res.json({
      file:
        req.file.path,
    });

  }
);

module.exports =
  router;