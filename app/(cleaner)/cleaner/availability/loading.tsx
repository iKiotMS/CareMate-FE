import { SkeletonCard } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
