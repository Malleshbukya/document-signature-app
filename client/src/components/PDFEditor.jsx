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

  const handleDragEnd =
    async (e) => {

      const newX =
        e.clientX - 100;

      const newY =
        e.clientY - 100;

      setSignaturePos({
        x: newX,
        y: newY,
      });

      console.log(
        "X:",
        newX,
        "Y:",
        newY
      );

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        await axios.post(
          "http://localhost:5000/api/signatures",
          {
            documentId: 1,
            x: newX,
            y: newY,
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

  const pdfUrl =
    "http://localhost:5000/uploads/1780812699150-Adnoc_CV_Mallesh1.pdf";

  return (
    <div
      style={{
        position: "relative",
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
        draggable
        onDragEnd={
          handleDragEnd
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
          padding: "10px",
          border:
            "2px solid black",
          cursor: "move",
          zIndex: 1000,
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