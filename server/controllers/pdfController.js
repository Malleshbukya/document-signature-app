const fs = require("fs");
const path = require("path");
const db = require("../db/database");
const { PDFDocument } = require("pdf-lib");

const generateSignedPdf = async (
  req,
  res
) => {

  console.log(
    "GENERATE PDF STARTED"
  );

  console.log(
    "BODY:",
    req.body
  );

  try {

    const {
      documentId,
    } = req.body;

    console.log(
      "DOCUMENT ID:",
      documentId
    );

    const documentData = db
      .prepare(`
        SELECT *
        FROM documents
        WHERE id = ?
      `)
      .get(documentId);

    console.log(
      "DOCUMENT DATA:",
      documentData
    );

    if (!documentData) {

      return res
        .status(404)
        .json({
          message:
            "Document not found",
        });

    }

    const inputPath =
      documentData.file_path;

    console.log(
      "INPUT PATH:",
      inputPath
    );

    if (
      !fs.existsSync(
        inputPath
      )
    ) {

      return res
        .status(404)
        .json({
          message:
            "PDF file not found on server",
          path:
            inputPath,
        });

    }

    const signatureData = db
      .prepare(`
        SELECT *
        FROM signatures
        WHERE document_id = ?
        ORDER BY id DESC
        LIMIT 1
      `)
      .get(documentId);

    console.log(
      "SIGNATURE DATA:",
      signatureData
    );

    if (!signatureData) {

      return res
        .status(404)
        .json({
          message:
            "No signature coordinates found",
        });

    }

    const signaturesDir =
      path.join(
        __dirname,
        "../uploads/signatures"
      );

    console.log(
      "SIGNATURE DIR:",
      signaturesDir
    );

    if (
      !fs.existsSync(
        signaturesDir
      )
    ) {

      return res
        .status(404)
        .json({
          message:
            "Signature folder not found",
        });

    }

    const signatureFiles =
      fs.readdirSync(
        signaturesDir
      );

    console.log(
      "SIGNATURE FILES:",
      signatureFiles
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

    console.log(
      "LATEST SIGNATURE:",
      signaturePath
    );

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
      "PDF X:",
      pdfX
    );

    console.log(
      "PDF Y:",
      pdfY
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

    console.log(
      "OUTPUT PATH:",
      outputPath
    );

    fs.writeFileSync(
      outputPath,
      pdfBytes
    );

    db.prepare(`
      UPDATE documents
      SET status = ?
      WHERE id = ?
    `).run(
      "Signed",
      documentId
    );

    console.log(
      "SIGNED PDF CREATED"
    );

    res.json({
      message:
        "Signed PDF generated successfully",
      file:
        `/uploads/${outputFileName}`,
    });

  } catch (error) {

    console.log(
      "PDF ERROR:"
    );

    console.log(
      error
    );

    res.status(500).json({
      error:
        error.message,
    });

  }

};

module.exports = {
  generateSignedPdf,
};