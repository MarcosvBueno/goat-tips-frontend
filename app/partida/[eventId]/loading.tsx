import { CardSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function MatchLoading() {
  return (
    <div className="px-6 py-6 max-w-[1280px] mx-auto animate-fade-in">
      <Skeleton className="h-5 w-28 mb-4" />
      <CardSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <Skeleton className="h-[180px]" />
        <Skeleton className="h-[180px]" />
        <Skeleton className="h-[280px]" />
        <Skeleton className="h-[280px]" />
        <Skeleton className="h-[200px] md:col-span-2" />
      </div>
    </div>
  );
}
