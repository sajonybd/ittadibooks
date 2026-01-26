


"use client";

import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Modal, Fade, Backdrop } from "@mui/material";

const PdfViewerComponentNew = ({ open, setOpen, pdfUrl }) => {
  //  Create plugin instance inside component
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [], // removes all side tabs
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const {
            DownloadButton,
            PrintButton,
            FullScreenButton,
            OpenFileButton,
            ...rest
          } = slots;
          return <>{Object.values(rest)}</>; // keep only zoom, page nav, rotate
        }}
      </Toolbar>
    ),
  });

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500 }}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Fade in={open}>
        <div
          style={{
            width: "95%",             // mobile: almost full width
            maxWidth: "1200px",        // large screens: max width
            height: "90%",            // fills most of viewport height
            maxHeight: "90vh",
            background: "#fff",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            margin: "0 auto",
          }}
        >
          {/* Header with close button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 16px",
              borderBottom: "1px solid #ddd",
              background: "#fffefeff",
            }}
          >
            <h4 style={{ margin: 0 }}>PDF Preview</h4>
            <button
              onClick={() => setOpen(false)}
              style={{
                border: "none",
                background: "transparent",
                fontSize: "20px",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* PDF Viewer */}
          <div
            style={{
              flex: 1,
              overflow: "hidden",
              userSelect: "none", // disable text selection
            }}
            onContextMenu={(e) => e.preventDefault()} // disable right click
          >
            <Worker workerUrl="/pdf.worker.min.js">
              <Viewer
                fileUrl={pdfUrl}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        </div>
      </Fade>
    </Modal>
  );
};

export default PdfViewerComponentNew;
