import React from "react";

export default function SkeletonForBookCollection() {
  return (
    <div className="flex w-full flex-col gap-4 h-[300px]">
      <div className="skeleton h-32 w-full" />
      <div className="skeleton h-4 w-28" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-12 w-full" />
    </div>
  );
}
