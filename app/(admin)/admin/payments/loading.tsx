import { SkeletonTable } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="p-6">
      <SkeletonTable rows={8} />
    </div>
  );
}
