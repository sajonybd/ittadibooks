import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function MobileSidebar({ filterOpen, setFilterOpen, children }) {
  if (!filterOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50">
      <div className="bg-white rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto w-full relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button onClick={() => setFilterOpen(false)}>
            <X size={22} />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
