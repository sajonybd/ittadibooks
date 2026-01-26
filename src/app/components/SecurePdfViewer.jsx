


"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function SecurePdfViewer({ pdfId, watermarkText = "CONFIDENTIAL" }) {
    const [fileUrl, setFileUrl] = useState(null);
    const [numPages, setNumPages] = useState(null);

    useEffect(() => {
        let objectUrl = null;

        const loadPdf = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pdf/view/${pdfId}`);
                if (!res.ok) throw new Error("Failed to load PDF");

                const blob = await res.blob();
                objectUrl = URL.createObjectURL(blob);
                setFileUrl(objectUrl);
            } catch (err) {
                console.error(err);
            }
        };

        loadPdf();

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [pdfId]);

    const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

    if (!fileUrl) return <p>Loading PDF…</p>;

    return (
        <div
            style={{
                height: "100vh",
                overflow: "auto",
                userSelect: "none", // disable text selection
                position: "relative",
            }}
            onContextMenu={(e) => e.preventDefault()} // block right-click
        >
            {watermarkText && (
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%) rotate(-30deg)",
                        opacity: 0.1,
                        fontSize: "5rem",
                        pointerEvents: "none",
                        zIndex: 10,
                        color: "black",
                        whiteSpace: "nowrap",
                    }}
                >
                    {watermarkText}
                </div>
            )}
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(numPages), (el, index) => (
                    <Page
                        key={`page_${index + 1}`}
                        pageNumber={index + 1}
                        width={window.innerWidth * 0.9}
                        renderTextLayer={false} // disable text layer (prevents copy)
                        renderAnnotationLayer={false} // remove links, popups
                    />
                ))}
            </Document>
        </div>
    );
}
