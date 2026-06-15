import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

function SignaturePad({
  setSignatureImage,
}) {
  const sigRef = useRef();

  const saveSignature = () => {
    const image =
      sigRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

    setSignatureImage(image);
  };

  return (
    <div>
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          width: 400,
          height: 200,
          className: "border",
        }}
      />

      <button
        onClick={saveSignature}
      >
        Save Signature
      </button>
    </div>
  );
}

export default SignaturePad;