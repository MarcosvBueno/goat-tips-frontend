import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("animate-pulse rounded-[14px] bg-(--bg3)", className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-[14px] p-5">
      <Skeleton className="h-6 w-20 mb-4" />
      <div className="flex items-center justify-between mb-5">
        <div className="flex-1 flex flex-col items-center gap-2">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-10 w-24 mx-4" />
        <div className="flex-1 flex flex-col items-center gap-2">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-6 w-full mb-3" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
