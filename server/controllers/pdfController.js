const fs = require("fs");
const path = require("path");
const db = require("../db/database");
const { PDFDocument } = require("pdf-lib");

const generateSignedPdf = async (
  req,
  res
) => {

  try {

    const {
      documentId,
    } = req.body;

    const documentData = db
      .prepare(`
        SELECT *
        FROM documents
        WHERE id = ?
      `)
      .get(documentId);

    if (!documentData) {

      return res
        .status(404)
        .json({
          message:
            "Document not found",
        });

    }

    const inputPath =
      path.join(
        __dirname,
        "..",
        documentData.file_path
      );

    const signatureData = db
      .prepare(`
        SELECT *
        FROM signatures
        WHERE document_id = ?
        ORDER BY id DESC
        LIMIT 1
      `)
      .get(documentId);

    if (!signatureData) {

      return res
        .status(404)
        .json({
          message:
            "No signature coordinates found",
        });

    }

    // Get latest uploaded signature image

    const signaturesDir =
      path.join(
        __dirname,
        "../uploads/signatures"
      );

    if (!fs.existsSync(signaturesDir)) {
  return res.status(404).json({
    message: "Signature folder not found",
  });
}

const signatureFiles =
  fs.readdirSync(
    signaturesDir
  );

    if (
      signatureFiles.length === 0
    ) {

      return res
        .status(404)
        .json({
          message:
            "No signature image found",
        });

    }

    const latestSignature =
      signatureFiles
        .sort()
        .pop();

    const signaturePath =
      path.join(
        signaturesDir,
        latestSignature
      );

   if (!fs.existsSync(inputPath)) {
  return res.status(404).json({
    message: "PDF file not found on server",
    path: inputPath,
  });
}

const existingPdf =
  fs.readFileSync(
    inputPath
  );

    const pdfDoc =
      await PDFDocument.load(
        existingPdf
      );

    const signatureBytes =
      fs.readFileSync(
        signaturePath
      );

    let signatureImage;

    if (
      latestSignature
        .toLowerCase()
        .endsWith(".png")
    ) {

      signatureImage =
        await pdfDoc.embedPng(
          signatureBytes
        );

    } else {

      signatureImage =
        await pdfDoc.embedJpg(
          signatureBytes
        );

    }

    const pages =
      pdfDoc.getPages();

    const firstPage =
      pages[0];

    const pageWidth =
      firstPage.getWidth();

    const pageHeight =
      firstPage.getHeight();

    const reactPdfWidth =
      700;

    const scale =
      pageWidth /
      reactPdfWidth;

    const imageWidth =
      150;

    const imageHeight =
      120;

   
const pdfX =
  Number(
    signatureData.x
  ) * scale;

const pdfY =
  pageHeight -
  (
    Number(
      signatureData.y
    ) * scale
  ) -
  imageHeight;

console.log(
  "React X:",
  signatureData.x
);

console.log(
  "React Y:",
  signatureData.y
);

console.log(
  "PDF X:",
  pdfX
);

console.log(
  "PDF Y:",
  pdfY
);

console.log(
  "Scale:",
  scale
);

console.log(
  "Page Width:",
  pageWidth
);

console.log(
  "Page Height:",
  pageHeight
);

    firstPage.drawImage(
      signatureImage,
      {
        x: pdfX,
        y: pdfY,
        width:
          imageWidth,
        height:
          imageHeight,
      }
    );

    const pdfBytes =
      await pdfDoc.save();

    const outputFileName =
      `signed-${documentId}.pdf`;

    const outputPath =
      path.join(
        __dirname,
        "../uploads",
        outputFileName
      );

    fs.writeFileSync(
  outputPath,
  pdfBytes
);

// Update document status to Signed

db.prepare(`
  UPDATE documents
  SET status = ?
  WHERE id = ?
`).run(
  "Signed",
  documentId
);

res.json({
  message:
    "Signed PDF generated successfully",
  file:
    `/uploads/${outputFileName}`,
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
  generateSignedPdf,
};