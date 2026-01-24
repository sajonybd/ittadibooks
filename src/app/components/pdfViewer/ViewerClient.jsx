"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// FINAL working worker config
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function ViewerClient({ file }) {
  const [numPages, setNumPages] = useState(null);

  const onLoadSuccess = ({ numPages }) => setNumPages(numPages);

  return (
    <Document file={file} onLoadSuccess={onLoadSuccess}>
      {Array.from(new Array(numPages), (el, i) => (
        <Page key={i} pageNumber={i + 1} />
      ))}
    </Document>
  );
}








