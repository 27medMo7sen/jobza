"use client";

import { useEffect, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { useHttp } from "@/hooks/use-http";
import { toast } from "sonner";
import { setUser } from "@/lib/slices/authSlice";
import { addFile } from "@/lib/slices/filesSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function SignaturePad() {
  const sigCanvas = useRef<SignatureCanvas>(null);
  const [penColor, setPenColor] = useState("black"); // fallback
  const [trimmedDataURL, setTrimmedDataURL] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { post } = useHttp();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  // Load CSS variable once mounted
  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    const color = rootStyles.getPropertyValue("--foreground").trim();
    if (color) setPenColor(color);
  }, []);

  const clear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setTrimmedDataURL(null);
    }
  };

  const uploadSignature = async (signatureData: string) => {
    try {
      setIsSaving(true);

      // Convert data URL to blob
      const response = await fetch(signatureData);
      const blob = await response.blob();

      // Create FormData to send the file
      const formData = new FormData();
      formData.append("file", blob, "signature.png");
      formData.append("type", "picture");
      formData.append("label", "signature");

      // Send to backend with proper headers for FormData
      const result = await post<any>("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Add the signature file to Redux store for real-time update
      const fileData = {
        id: "signature",
        name: result.fileName,
        type: result.fileType,
        url: result.url,
        status: result.status,
        rejectionReason: result.rejectionReason,
        uploadedAt: new Date().toISOString(),
        fileName: result.fileName,
        s3Key: result.s3Key,
        size: result.size,
        dataUrl: signatureData,
      };

      dispatch(addFile(fileData));

      // Update user state with signature flag
      console.log("Current user before update:", user);
      const updatedUser = { ...user, signature: true };
      console.log("Updated user:", updatedUser);
      dispatch(setUser(updatedUser));
      toast.success("Signature Saved", {
        description: "Your signature has been saved successfully",
      });
      console.log("Signature uploaded successfully:", result);

      return result;
    } catch (error) {
      console.error("Error uploading signature:", error);
      toast.error("Upload Failed", {
        description: "Failed to save signature. Please try again.",
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const save = async () => {
    if (!sigCanvas.current) {
      toast.error("Canvas Error", {
        description: "Signature canvas not initialized",
      });
      return;
    }

    if (sigCanvas.current.isEmpty()) {
      toast.error("Empty Signature", {
        description: "Please provide a signature before saving",
      });
      return;
    }

    const confirmed = window.confirm(
      "⚠️ WARNING: Once you save this signature, you will NOT be able to change it in the future.\n\n" +
        "Please make sure this is your final signature before proceeding.\n\n" +
        "Do you want to continue and save this signature?"
    );

    if (!confirmed) {
      toast.info("Cancelled", {
        description: "Signature save was cancelled",
      });
      return;
    }

    try {
      const dataURL = sigCanvas.current.toDataURL("image/png");
      setTrimmedDataURL(dataURL);

      await uploadSignature(dataURL);

      console.log("Signature saved successfully");
    } catch (error) {
      console.error("Error saving signature:", error);
      // Error toast is already shown in uploadSignature
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <SignatureCanvas
        ref={sigCanvas}
        penColor={penColor}
        backgroundColor="white"
        canvasProps={{
          width: 500,
          height: 200,
          className: "border rounded-md bg-white",
        }}
      />
      <div className="flex gap-2">
        <button
          onClick={clear}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          disabled={isSaving}
        >
          Clear
        </button>
        <button
          onClick={save}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
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
