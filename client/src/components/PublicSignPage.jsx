import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function PublicSignPage() {
  const { token } = useParams();

  const [document, setDocument] =
    useState(null);

  useEffect(() => {
    fetchDocument();
  }, []);

  const fetchDocument =
    async () => {
      try {
        const response =
          await axios.get(
            `https://document-signature-app-lgxn.onrender.com/api/share/public/${token}`
          );

        setDocument(
          response.data
        );

      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>
        Public Signature Page
      </h1>

      <h3>
        Token:
      </h3>

      <p>{token}</p>

      {document && (
        <div>
          <h2>
            Document Details
          </h2>

          <p>
            ID:
            {document.id}
          </p>

          <p>
            File:
            {
              document.file_name
            }
          </p>

          <p>
            Owner:
            {
              document.owner_id
            }
          </p>
        </div>
      )}
    </div>
  );
}

export default PublicSignPage;