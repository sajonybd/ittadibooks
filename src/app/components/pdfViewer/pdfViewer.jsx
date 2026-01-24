

// "use client";

// import React, { useEffect, useState } from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// // import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import { Backdrop, Fade, Grid, Modal } from "@mui/material";
// import "./pdf.css"
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// const defaultLayoutPluginInstance = defaultLayoutPlugin({
//   toolbarPlugin: {
//     downloadPlugin: {
//       renderDownload: () => null,
//     },
//     printPlugin: {
//       renderPrint: () => null,
//     },
//   },
// });

// const PdfViewerComponentNew = ({ open, setOpen,pdfUrl }) => {
//   const [fileUrl, setFileUrl] = useState(null);
//   // const defaultLayoutPluginInstance = defaultLayoutPlugin();


//   const handleClose = () => {
//     setOpen(false); // closes the modal
//   };

//   return (
//     // <div className="w-full h-[90vh]">


//     //   <Modal
//     //     open={open}
//     //     onClose={handleClose}
//     //     closeAfterTransition
//     //     BackdropComponent={Backdrop}
//     //     BackdropProps={{ timeout: 500 }}
//     //     sx={{
//     //       display: 'flex',
//     //       alignItems: 'center',
//     //       justifyContent: 'center',
//     //     }}
//     //   >
//     //     <Fade in={open}>
//     //       <div
//     //         style={{
//     //           background: 'white',
//     //           borderRadius: '8px',
//     //           width: '70%',
//     //           height: '90%',
//     //           boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
//     //           padding: '16px',
//     //         }}
//     //       >
//     //         <Grid
//     //           container
//     //           direction='row'
//     //           justify='space-between'
//     //           alignItems='flex-start'
//     //           style={{ marginBottom: '10px' }}
//     //         >
//     //           <Grid className="flex justify-between w-full">
//     //             <h4 id='transition-modal-title'>PDF Preview</h4>
//     //             <button onClick={handleClose}>X</button>
//     //           </Grid>
//     //         </Grid>

//     //         <p
//     //           id='transition-modal-description'
//     //           style={{ width: '100%', height: '95%' }}
//     //         >
//     //           <embed
//     //             style={{
//     //               width: '100%',
//     //               height: '100%',
//     //               borderRadius: '6px',
//     //               pointerEvents: "true",
//     //             }}
//     //             type='application/pdf'
//     //             src={pdfUrl}
//     //             // src='https://drive.google.com/file/d/1ESLwoO-Eq9VTP1xnHuGgpsv7QfnDP7Rc/preview'

//     //           />
//     //         </p>
//     //       </div>
//     //     </Fade>
//     //   </Modal>

//     // </div>
//      <Modal open={open} onClose={() => setOpen(false)}>
//       <div style={{ width: "70%", height: "90%", background: "#fff" }}>
//         <Worker  workerUrl="/pdf.worker.min.js">
//           <Viewer
//             fileUrl={pdfUrl}
//             plugins={[defaultLayoutPluginInstance]}
//           />
//         </Worker>
//       </div>
//     </Modal>
//   );
// };

// export default PdfViewerComponentNew;

// "use client";

// import React, { useMemo } from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import { Modal } from "@mui/material";
// import "./pdf.css";

// const PdfViewerComponentNew = ({ open, setOpen, pdfUrl }) => {
//   // ✅ create the plugin instance INSIDE the component using useMemo
//   const defaultLayoutPluginInstance = useMemo(
//     () =>
//       defaultLayoutPlugin({
//         toolbarPlugin: {
//           downloadPlugin: { renderDownload: () => null },
//           printPlugin: { renderPrint: () => null },
//         },
//       }),
//     []
//   );

//   return (
//     <Modal open={open} onClose={() => setOpen(false)}>
//       <div style={{ width: "70%", height: "90%", background: "#fff" }}>
//         <Worker workerUrl="/pdf.worker.min.js">
//           <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
//         </Worker>
//       </div>
//     </Modal>
//   );
// };

// export default PdfViewerComponentNew;


// "use client";

// import React from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import { Modal } from "@mui/material";
// import "./pdf.css";

// const PdfViewerComponentNew = ({ open, setOpen, pdfUrl }) => {
//   // ✅ create plugin instance directly inside the component
//   const defaultLayoutPluginInstance = defaultLayoutPlugin({
//   sidebarTabs: () => [], // ❌ empty array = no sidebar tabs at all
//   renderToolbar: (Toolbar) => (
//     <Toolbar>
//       {(slots) => {
//         const { DownloadButton, PrintButton, FullScreenButton, OpenFileButton, ...rest } = slots;
//         return <>{Object.values(rest)}</>; // only keep desired buttons
//       }}
//     </Toolbar>
//   ),
// });

//   return (
//     <Modal className="modalDiv" open={open} onClose={() => setOpen(false)}>
//       <div className="pdfDiv" onContextMenu={(e) => e.preventDefault()}
//         style={{ width: "70%", height: "90%", background: "#fff", userSelect: "none" }}>
//         <Worker workerUrl="/pdf.worker.min.js">
//           <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
//         </Worker>
//       </div>
//     </Modal>
//   );
// };

// export default PdfViewerComponentNew;

// "use client";

// import React from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import { Modal, Fade, Backdrop } from "@mui/material";
// import "./pdf.css";

// const PdfViewerComponentNew = ({ open, setOpen, pdfUrl }) => {
//   // Create plugin instance inside the component
//   const defaultLayoutPluginInstance = defaultLayoutPlugin({
//     sidebarTabs: () => [], // removes all side tabs
//     renderToolbar: (Toolbar) => (
//       <Toolbar>
//         {(slots) => {
//           const { DownloadButton, PrintButton, FullScreenButton, OpenFileButton, ...rest } = slots;
//           return <>{Object.values(rest)}</>; // only keep zoom, page nav, rotate, etc.
//         }}
//       </Toolbar>
//     ),
//   });

//   return (
//     <Modal
//       open={open}
//       onClose={() => setOpen(false)}
//       closeAfterTransition
//       BackdropComponent={Backdrop}
//       BackdropProps={{ timeout: 500 }}
//       sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
//     >
//       <Fade in={open}>
//         <div
//           style={{
//             width: "70%",
//             height: "90%",
//             background: "#fff",
//             borderRadius: "8px",
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden",
//           }}
//         >
//           {/* Header with Close Button */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               padding: "10px 16px",
//               borderBottom: "1px solid #ddd",
//               background: "#d1d1d1ff",
//             }}
//           >
//             <h4 style={{ margin: 0 }}>PDF Preview</h4>
//             <button
//               onClick={() => setOpen(false)}
//               style={{
//                 border: "none",
//                 background: "transparent",
//                 fontSize: "20px",
//                 cursor: "pointer",
//               }}
//             >
//               ✕
//             </button>
//           </div>

//           {/* PDF Viewer */}
//           <div style={{ flex: 1, overflow: "hidden", userSelect: "none" }} onContextMenu={(e) => e.preventDefault()}>
//             <Worker workerUrl="/pdf.worker.min.js">
//               <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
//             </Worker>
//           </div>
//         </div>
//       </Fade>
//     </Modal>
//   );
// };

// export default PdfViewerComponentNew;


// "use client";

// import React from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import { Modal, Fade, Backdrop } from "@mui/material";
// import "./pdf.css";

// const PdfViewerComponentNew = ({ open, setOpen, pdfUrl }) => {
//   // Create plugin instance inside the component
//   const defaultLayoutPluginInstance = defaultLayoutPlugin({
//     sidebarTabs: () => [], // removes all side tabs
//     renderToolbar: (Toolbar) => (
//       <Toolbar>
//         {(slots) => {
//           const { DownloadButton, PrintButton, FullScreenButton, OpenFileButton, ...rest } = slots;
//           return <>{Object.values(rest)}</>; // only keep zoom, page nav, rotate, etc.
//         }}
//       </Toolbar>
//     ),
//   });

//   return (
//     <Modal
//       open={open}
//       onClose={() => setOpen(false)}
//       closeAfterTransition
//       BackdropComponent={Backdrop}
//       BackdropProps={{ timeout: 500 }}
//       sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
//     >
//       <Fade in={open}>
//         <div
//           style={{
//             width: "95%",        // mobile: almost full width
//             maxWidth: "900px",   // tablet/laptop/large: limit max width
//             height: "90%",       // almost full height
//             maxHeight: "90vh",   // prevent overflow on large screens
//             background: "#fff",
//             borderRadius: "8px",
//             display: "flex",
//             flexDirection: "column",
//             overflow: "hidden",
//             margin: "0 auto",    // center horizontally
//           }}
//         >
//           {/* Header with Close Button */}
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               padding: "10px 16px",
//               borderBottom: "1px solid #ddd",
//               background: "#d1d1d1ff",
//             }}
//           >
//             <h4 style={{ margin: 0 }}>PDF Preview</h4>
//             <button
//               onClick={() => setOpen(false)}
//               style={{
//                 border: "none",
//                 background: "transparent",
//                 fontSize: "20px",
//                 cursor: "pointer",
//               }}
//             >
//               ✕
//             </button>
//           </div>

//           {/* PDF Viewer */}
//           <div style={{ flex: 1, overflow: "hidden", userSelect: "none" }} onContextMenu={(e) => e.preventDefault()}>
//             <Worker workerUrl="/pdf.worker.min.js">
//               <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
//             </Worker>
//           </div>
//         </div>
//       </Fade>
//     </Modal>
//   );
// };

// export default PdfViewerComponentNew;


"use client";

import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Modal, Fade, Backdrop } from "@mui/material";

const PdfViewerComponentNew = ({ open, setOpen, pdfUrl }) => {
  // ✅ Create plugin instance inside component
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
            maxWidth: "900px",        // large screens: max width
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
