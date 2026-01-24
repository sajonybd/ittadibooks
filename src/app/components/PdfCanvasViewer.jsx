


"use client";

import { useEffect, useState } from "react";

export default function PdfCanvasViewer({ pdfId }) {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/pdf/view/${pdfId}`);
      const data = await res.json();
      setPages(data.pages);
      console.log("Loaded pages:", data.pages);
    };

    load();
  }, [pdfId]);

  return (
    <div
      style={{
        width: "100%",
        userSelect: "none",
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {pages.map((img, i) => (
        <img
          key={i}
          src={img}
          style={{
            width: "100%",
            pointerEvents: "none",
          }}
          alt={`Page ${i + 1}`}
        />
      ))}
    </div>
  );
}
