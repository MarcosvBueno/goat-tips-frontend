import { Skeleton } from "@/components/ui/skeleton";

export default function SimuladorLoading() {
  return (
    <div className="px-6 py-6 max-w-[1280px] mx-auto animate-fade-in">
      <Skeleton className="h-10 w-48 mb-4" />
      <Skeleton className="h-5 w-80 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[300px]" />
      </div>
    </div>
  );
}
