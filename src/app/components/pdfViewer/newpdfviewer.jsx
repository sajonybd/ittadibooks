// "use client";

// import { Document, Page, pdfjs } from "react-pdf";
// import { useEffect, useState } from "react";

// // Serve worker from local public folder to avoid CORS
// pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

// export default function SecurePdfViewerFinal({ bookId }) {
//   const [numPages, setNumPages] = useState(null);

//   useEffect(() => {
//     // 🚫 Disable right click
//     const disableContext = (e) => e.preventDefault();
//     document.addEventListener("contextmenu", disableContext);

//     // 🚫 Disable print / save / screenshot
//     const blockKeys = (e) => {
//       if (
//         (e.ctrlKey && ["p", "s"].includes(e.key.toLowerCase())) ||
//         e.key === "PrintScreen"
//       ) {
//         e.preventDefault();
//       }
//     };

//     window.addEventListener("keydown", blockKeys);

//     return () => {
//       document.removeEventListener("contextmenu", disableContext);
//       window.removeEventListener("keydown", blockKeys);
//     };
//   }, []);

  

//   return (
//     <div style={{ userSelect: "none" }}>
//       <Document
//         file={`/api/pdf/pdfView/${bookId}`}
//         onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//         loading="Loading PDF..."
//       >
//         {Array.from(new Array(numPages), (_, i) => (
//           <Page
//             key={i}
//             pageNumber={i + 1}
//             renderTextLayer={false}
//             renderAnnotationLayer={false}
//           />
//         ))}
//       </Document>
//     </div>
//   );
// }



"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";

// Serve worker from local public folder
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

export default function SecurePdfViewer({ bookId }) {
  const [numPages, setNumPages] = useState(null);

  useEffect(() => {
    // 🚫 Disable right click
    const disableContext = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableContext);

    // 🚫 Disable print/save/screenshot
    const blockKeys = (e) => {
      if ((e.ctrlKey && ["p", "s"].includes(e.key.toLowerCase())) || e.key === "PrintScreen") {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("contextmenu", disableContext);
      window.removeEventListener("keydown", blockKeys);
    };
  }, []);

  return (
    <div style={{ userSelect: "none" }}>
      <Document
        file={`/api/pdf/${bookId}`}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        loading="Loading PDF..."
      >
        {Array.from(new Array(numPages), (_, i) => (
          <Page
            key={i}
            pageNumber={i + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        ))}
      </Document>
    </div>
  );
}
