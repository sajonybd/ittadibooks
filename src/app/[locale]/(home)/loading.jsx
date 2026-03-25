import SkeletonForBookCollection from "@/app/components/SkeletonForBookCollection/SkeletonForBookCollection";

function SectionSkeleton({ items = 12 }) {
  return (
    <div className="mt-8">
      <div className="skeleton h-7 w-48 mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        {[...Array(items)].map((_, idx) => (
          <SkeletonForBookCollection key={idx} />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="bg-gray-200 w-full lg:py-4 min-h-screen">
      <div className="max-w-full w-full mx-auto flex flex-col lg:flex-row gap-2 lg:gap-4">
        {/* Sidebar skeleton */}
        <div className="lg:w-72 shrink-0">
          <div className="sticky top-6 p-4 lg:p-0">
            <div className="skeleton h-10 w-full mb-4" />
            <div className="skeleton h-6 w-2/3 mb-2" />
            <div className="skeleton h-6 w-3/4 mb-2" />
            <div className="skeleton h-6 w-1/2 mb-4" />
            <div className="skeleton h-10 w-full mb-4" />
            <div className="skeleton h-10 w-full mb-4" />
            <div className="skeleton h-10 w-full" />
          </div>
        </div>

        {/* Main skeleton */}
        <div className="min-w-0 flex-1 p-4 lg:p-0">
          {/* Banner / cover */}
          <div className="skeleton w-full rounded-xl h-44 sm:h-56 lg:h-72" />

          {/* Notice */}
          <div className="mt-6 p-4 rounded-xl bg-white">
            <div className="skeleton h-6 w-40 mb-3" />
            <div className="skeleton h-4 w-full mb-2" />
            <div className="skeleton h-4 w-5/6" />
          </div>

          {/* Video */}
          <div className="mt-8">
            <div className="skeleton h-7 w-40 mb-4" />
            <div className="skeleton w-full rounded-xl h-48 sm:h-64 lg:h-80" />
          </div>

          {/* Collections */}
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
          <SectionSkeleton />
        </div>
      </div>
    </div>
  );
}

