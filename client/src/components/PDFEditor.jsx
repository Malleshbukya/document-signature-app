import { useState } from "react";
import axios from "axios";

import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import pdfWorker from
  "pdfjs-dist/build/pdf.worker.min.mjs?url";

import
  "react-pdf/dist/Page/TextLayer.css";

import
  "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc =
  pdfWorker;

function PDFEditor() {

  const [numPages, setNumPages] =
    useState(null);

  const [signaturePos, setSignaturePos] =
    useState({
      x: 120,
      y: 250,
    });

  const pdfUrl =
    "http://localhost:5000/uploads/1780812699150-Adnoc_CV_Mallesh1.pdf";

  const saveSignature =
    async (x, y) => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(
          "http://localhost:5000/api/signatures",
          {
            documentId: 1,
            x,
            y,
            page: 1,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Signature saved"
        );

      } catch (error) {

        console.log(error);

      }
    };

  const handleMouseDown =
    (e) => {

      const startX =
        e.clientX;

      const startY =
        e.clientY;

      const initialX =
        signaturePos.x;

      const initialY =
        signaturePos.y;

      const handleMouseMove =
        (e) => {

          setSignaturePos({
            x:
              initialX +
              (e.clientX - startX),

            y:
              initialY +
              (e.clientY - startY),
          });

        };

      const handleMouseUp =
        async (e) => {

          const finalX =
            initialX +
            (e.clientX - startX);

          const finalY =
            initialY +
            (e.clientY - startY);

          document.removeEventListener(
            "mousemove",
            handleMouseMove
          );

          document.removeEventListener(
            "mouseup",
            handleMouseUp
          );

          await saveSignature(
            finalX,
            finalY
          );

        };

      document.addEventListener(
        "mousemove",
        handleMouseMove
      );

      document.addEventListener(
        "mouseup",
        handleMouseUp
      );

    };

  return (
    <div
      style={{
        position: "relative",
        width: "700px",
        margin: "20px auto",
      }}
    >

      <Document
        file={pdfUrl}
        onLoadSuccess={(
          { numPages }
        ) =>
          setNumPages(
            numPages
          )
        }
      >

        {Array.from(
          new Array(
            numPages || 0
          ),
          (_, index) => (
            <Page
              key={index}
              pageNumber={
                index + 1
              }
              width={700}
            />
          )
        )}

      </Document>

      <div
        onMouseDown={
          handleMouseDown
        }
        style={{
          position:
            "absolute",

          left:
            signaturePos.x,

          top:
            signaturePos.y,

          background:
            "yellow",

          padding:
            "10px 20px",

          border:
            "2px solid black",

          cursor:
            "move",

          zIndex: 1000,

          fontWeight:
            "bold",

          userSelect:
            "none",
        }}
      >
        Sign Here
      </div>

    </div>
  );
}

export default PDFEditor;