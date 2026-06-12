import { useParams } from "react-router-dom";

function PublicSignPage() {
  const { token } = useParams();

  return (
    <div>
      <h1>
        Public Signature Page
      </h1>

      <p>
        Token: {token}
      </p>
    </div>
  );
}

export default PublicSignPage;