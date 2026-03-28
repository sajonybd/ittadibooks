


"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Modal, Fade } from "@mui/material";

const PdfViewerComponentNew = ({ open, setOpen, pdfUrl, pageImages = [] }) => {
  const DEFAULT_IMAGE_ZOOM = 1.25;
  const [currentPage, setCurrentPage] = useState(1);
  const [lastWheelAt, setLastWheelAt] = useState(0);
  const [touchStartY, setTouchStartY] = useState(null);
  const [layoutByUrl, setLayoutByUrl] = useState({});

  const sortedPages = useMemo(() => {
    return [...(pageImages || [])].sort(
      (a, b) => Number(a?.page || 0) - Number(b?.page || 0)
    );
  }, [pageImages]);

  useEffect(() => {
    let isCancelled = false;

    const detectLayouts = async () => {
      const entries = await Promise.all(
        sortedPages.map(
          (item) =>
            new Promise((resolve) => {
              const img = new Image();
              img.onload = () => {
                const isLandscape = img.naturalWidth > img.naturalHeight * 1.15;
                resolve([
                  item.url,
                  {
                    mode: isLandscape ? "split" : "single",
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                  },
                ]);
              };
              img.onerror = () =>
                resolve([item.url, { mode: "single", width: 0, height: 0 }]);
              img.src = item.url;
            })
        )
      );

      if (!isCancelled) {
        setLayoutByUrl(Object.fromEntries(entries));
      }
    };

    if (sortedPages.length > 0) {
      detectLayouts();
    } else {
      setLayoutByUrl({});
    }

    return () => {
      isCancelled = true;
    };
  }, [sortedPages]);

  const readingPages = useMemo(() => {
    return sortedPages.flatMap((item) => {
      if (layoutByUrl[item.url]?.mode === "split") {
        return [
          { ...item, view: "left" },
          { ...item, view: "right" },
        ];
      }
      return [{ ...item, view: "single" }];
    });
  }, [sortedPages, layoutByUrl]);

  useEffect(() => {
    if (open) setCurrentPage(1);
  }, [open, readingPages.length]);

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () =>
    setCurrentPage((p) => Math.min(readingPages.length, p + 1));
  const progressTop =
    readingPages.length > 1
      ? ((currentPage - 1) / (readingPages.length - 1)) * 100
      : 0;

  const handleWheel = (e) => {
    if (readingPages.length <= 1) return;
    e.preventDefault();

    const now = Date.now();
    if (now - lastWheelAt < 180) return;
    setLastWheelAt(now);

    if (e.deltaY > 0) {
      goNext();
    } else if (e.deltaY < 0) {
      goPrev();
    }
  };

  return (
    <>
      <style jsx global>{`
        .pdf-scroll-area::-webkit-scrollbar {
          width: 12px;
        }
        .pdf-scroll-area::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-left: 1px solid #e5e7eb;
        }
        .pdf-scroll-area::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 10px;
          border: 2px solid #f3f4f6;
        }
        .pdf-scroll-area::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
      <Modal
        open={open}
        onClose={() => {
          setTouchStartY(null);
          setOpen(false);
        }}
        disableScrollLock
        closeAfterTransition
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Fade in={open}>
          <div
            style={{
              position: "relative",
              width: "98%",
              maxWidth: "720px",
              height: "90%",
              maxHeight: "90vh",
              background: "#fff",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              margin: "0 auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
          <button
            onClick={() => setOpen(false)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 10,
              border: "none",
              background: "rgba(0,0,0,0.6)",
              color: "#fff",
              width: 30,
              height: 30,
              borderRadius: "50%",
              fontSize: "18px",
              cursor: "pointer",
            }}
          >
            ×
          </button>

          <div
            style={{
              flex: 1,
              overflowY: "scroll",
              overflowX: "hidden",
              userSelect: "none",
              background: "#fff",
              border: "2px solid #d1d5db",
              borderRadius: "8px",
              scrollbarWidth: "auto",
              scrollbarColor: "#6b7280 #f3f4f6",
            }}
            onContextMenu={(e) => e.preventDefault()}
            onWheel={handleWheel}
            onTouchStart={(e) => setTouchStartY(e.touches?.[0]?.clientY ?? null)}
            onTouchEnd={(e) => {
              if (readingPages.length <= 1 || touchStartY === null) return;
              const endY = e.changedTouches?.[0]?.clientY ?? touchStartY;
              const diff = touchStartY - endY;
              if (Math.abs(diff) < 30) return;
              if (diff > 0) goNext();
              else goPrev();
              setTouchStartY(null);
            }}
            className="pdf-scroll-area"
          >
            {readingPages.length > 0 ? (
              <div className="h-full flex flex-col relative">
                <div className="flex-1 flex items-center justify-center p-1 md:p-2 overflow-hidden">
                  {readingPages[currentPage - 1]?.view === "single" ? (
                    <img
                      src={readingPages[currentPage - 1]?.url}
                      alt={`Page ${currentPage}`}
                      className="w-full h-full max-h-[86vh] object-contain rounded mx-auto"
                      style={{
                        transform: `scale(${DEFAULT_IMAGE_ZOOM})`,
                        transformOrigin: "center center",
                      }}
                      draggable={false}
                    />
                  ) : (
                    <div
                      className="w-full max-h-[86vh] rounded overflow-hidden bg-white mx-auto"
                      style={{
                        aspectRatio: (() => {
                          const current = readingPages[currentPage - 1];
                          const meta = current ? layoutByUrl[current.url] : null;
                          if (meta?.width && meta?.height) {
                            return `${meta.width / 2} / ${meta.height}`;
                          }
                          return "3 / 4";
                        })(),
                      }}
                    >
                      <div className="relative w-full h-full overflow-hidden">
                        <img
                          src={readingPages[currentPage - 1]?.url}
                          alt={`Page ${currentPage}`}
                          className="absolute inset-y-0 left-0 h-full w-[200%] max-w-none"
                          style={{
                            transform:
                              readingPages[currentPage - 1]?.view === "left"
                                ? `translateX(0%) scale(${DEFAULT_IMAGE_ZOOM})`
                                : `translateX(-50%) scale(${DEFAULT_IMAGE_ZOOM})`,
                            transformOrigin:
                              readingPages[currentPage - 1]?.view === "left"
                                ? "left center"
                                : "right center",
                          }}
                          draggable={false}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="pointer-events-none absolute right-2 top-3 bottom-3 w-3 flex items-center justify-center">
                  <div className="relative h-[92%] w-1 rounded bg-gray-300">
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">
                      Start
                    </span>
                    <span
                      className="absolute left-1/2 -translate-x-1/2 h-4 w-4 rounded-full border border-white bg-[#51acec] shadow"
                      style={{ top: `calc(${progressTop}% - 8px)` }}
                    />
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-500">
                      End
                    </span>
                  </div>
                </div>
              </div>
            ) : pdfUrl ? (
              <div className="h-full p-2">
                <iframe
                  src={pdfUrl.includes("#") ? pdfUrl : `${pdfUrl}#zoom=150`}
                  title="PDF Preview"
                  className="w-full h-full border rounded bg-white"
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                No preview available
              </div>
            )}
          </div>
          </div>
        </Fade>
      </Modal>
    </>
  );
};

export default PdfViewerComponentNew;
