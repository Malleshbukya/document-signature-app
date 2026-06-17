import { useState } from "react";
import axios from "axios";

function UploadDocument() {

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const handleUpload =
    async () => {

      if (!file) {
        alert(
          "Please select a PDF file"
        );
        return;
      }

      const formData =
        new FormData();

      // IMPORTANT:
      // Backend expects "document"
      formData.append(
        "document",
        file
      );

      const token =
        localStorage.getItem(
          "token"
        );

      try {

        setLoading(true);

        await axios.post(
          "https://document-signature-app-lgxn.onrender.com/api/docs/upload",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Document Uploaded Successfully"
        );

        window.location.reload();

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data?.message ||
          error.response?.data?.error ||
          "Upload Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div
      className="
        bg-white
        rounded-xl
        shadow-lg
        p-6
        border
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-4
          text-gray-800
        "
      >
        Upload Document
      </h2>

      <p
        className="
          text-gray-500
          mb-4
        "
      >
        Select a PDF file and upload it.
      </p>

      <div
        className="
          flex
          flex-col
          md:flex-row
          gap-4
          items-center
        "
      >

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFile(
              e.target.files[0]
            )
          }
          className="
            w-full
            border
            rounded-lg
            p-2
          "
        />

        <button
          onClick={
            handleUpload
          }
          disabled={loading}
          className={`
            px-6
            py-2
            rounded-lg
            text-white
            font-semibold
            transition
            ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }
          `}
        >
          {loading
            ? "Uploading..."
            : "Upload"}
        </button>

      </div>

      {file && (
        <div
          className="
            mt-4
            text-green-600
            font-medium
          "
        >
          Selected:
          {" "}
          {file.name}
        </div>
      )}

    </div>

  );

}

export default UploadDocument;