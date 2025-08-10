"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

export default function AddReading() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect desktop users away
  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (!isMobile) {
      router.replace("/not-supported"); // create this page or redirect as you want
    }
  }, [router]);

  const videoConstraints = {
    facingMode: "environment",
  };

  // Capture photo from webcam
  const capture = useCallback(() => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prev) => [imageSrc, ...prev]);
    }
  }, [webcamRef]);

  // Upload all images
  const uploadImages = async () => {
    setUploading(true);
    setError(null);

    try {
      for (const base64Image of capturedImages) {
        const res = await fetch(base64Image);
        const blob = await res.blob();

        const formData = new FormData();
        formData.append("image", blob, "reading.jpg");

        const uploadRes = await fetch("/api/readings/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          throw new Error("Upload failed");
        }
      }

      alert("All images uploaded!");
      setCapturedImages([]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center bg-black min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-white">Add New Reading</h1>

      <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden border-4 border-blue-500 mb-4">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        {/* Placeholder frame is the blue border */}
      </div>

      <button
        onClick={capture}
        disabled={uploading}
        className="mb-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Capture Reading
      </button>

      <div className="mb-4 text-white">
        Images captured: <span className="font-semibold">{capturedImages.length}</span>
      </div>

      {capturedImages.length > 0 && (
        <button
          onClick={uploadImages}
          disabled={uploading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          {uploading ? "Uploading..." : "Upload All Images"}
        </button>
      )}

      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
}
