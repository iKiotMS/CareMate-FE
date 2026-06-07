import { SkeletonStatCard } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
    </div>
  );
}
