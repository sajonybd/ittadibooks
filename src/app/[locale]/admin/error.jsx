"use client";

import { useEffect } from "react";

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("Admin route error:", error);
  }, [error]);

  const digest = error?.digest ? String(error.digest) : null;

  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-semibold">Admin page failed to load</h1>
      <p className="mt-2 text-sm text-gray-700">
        This is usually caused by a server-side error (often database/network).
        Check server logs for the full stack trace.
      </p>

      {digest ? (
        <p className="mt-2 text-xs text-gray-500">Digest: {digest}</p>
      ) : null}

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => reset()}
        >
          Retry
        </button>
      </div>
    </div>
  );
}

