import { useState } from "react";
import axios from "axios";

function UploadSignature() {

  const [file, setFile] =
    useState(null);

  const uploadSignature =
    async () => {

      if (!file) {

        alert(
          "Please select a signature image"
        );

        return;

      }

      const formData =
        new FormData();

      formData.append(
        "signature",
        file
      );

      try {

        const response =
          await axios.post(
            "http://localhost:5000/api/signature-image",
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

       alert(
  "Signature Uploaded Successfully"
);

console.log(
  response.data
);

// Refresh page so latest signature loads

window.location.reload();

      } catch (error) {

        console.log(error);

        alert(
          "Upload Failed"
        );

      }

    };

  return (

    <div
      className="
        bg-white
        p-6
        rounded-xl
        shadow-lg
        border
      "
    >

      <h2
        className="
          text-2xl
          font-bold
          mb-4
        "
      >
        Upload Signature
      </h2>

      <input
        type="file"
        accept=".png,.jpg,.jpeg"
        onChange={(e) =>
          setFile(
            e.target.files[0]
          )
        }
        className="
          border
          p-2
          rounded
          w-full
        "
      />

      <button
        onClick={
          uploadSignature
        }
        className="
          mt-4
          bg-blue-600
          text-white
          px-4
          py-2
          rounded
          hover:bg-blue-700
        "
      >
        Upload Signature
      </button>

    </div>

  );

}

export default UploadSignature;