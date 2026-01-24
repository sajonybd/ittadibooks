 


"use client";

import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// 🔥 FIX: Use local worker (NOT CDN)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const SecurePdfViewer = ({ pdfId }) => {
  const [pdfBlob, setPdfBlob] = useState(null);
  const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const res = await fetch(`/api/pdf/protectpdf/${pdfId}`);
        if (!res.ok) throw new Error("PDF not found");

        const blob = await res.blob();
        setPdfBlob(blob);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPdf();
  }, [pdfId]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  if (!pdfBlob) return <p>Loading PDF...</p>;

  return (
    <div
      style={{
        width: "100%",
        height: "90vh",
        overflow: "auto",
        userSelect: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Document
        file={pdfBlob}
        onLoadSuccess={onDocumentLoadSuccess}
        loading="Loading PDF..."
      >
        {numPages > 0 &&
          Array.from({ length: numPages }, (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              renderMode="canvas"
              width={typeof window !== "undefined" ? window.innerWidth * 0.8 : 800}
            />
          ))}
      </Document>
    </div>
  );
};

export default SecurePdfViewer;
