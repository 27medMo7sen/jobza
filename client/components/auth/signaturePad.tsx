"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

export default function SignaturePad() {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [trimmedDataURL, setTrimmedDataURL] = useState<string | null>(null);

  const clear = () => sigCanvas.current?.clear();

  const save = () => {
    if (sigCanvas.current?.isEmpty())
      return alert("Please provide a signature");
    if (sigCanvas.current) {
      setTrimmedDataURL(
        sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-card p-4">
      <SignatureCanvas
        ref={sigCanvas}
        penColor="black"
        backgroundColor="white"
        canvasProps={{
          width: 500,
          height: 200,
          className: "border rounded-md cursor-crosshair",
        }}
      />
      <div className="flex gap-2">
        <button onClick={clear} className="px-4 py-2 bg-gray-300 rounded">
          Clear
        </button>
        <button
          onClick={save}
          className="px-4 py-2 bg-blue-500 text-gray-100 rounded"
        >
          Save
        </button>
      </div>
      {trimmedDataURL && (
        <div>
          <p>Preview:</p>
          <img src={trimmedDataURL} alt="signature" className="border" />
        </div>
      )}
    </div>
  );
}
