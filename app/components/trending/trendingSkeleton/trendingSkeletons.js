import {Skeleton} from "@heroui/react";

export function TrendingSkeletons() {
  return (
    <div className="grid w-full max-w-xl grid-cols-3 gap-13">
      <Skeleton className="h-30 w-30 rounded-xl" />
      <Skeleton className=" h-30 w-30 rounded-xl" />
      <Skeleton className=" h-30 w-30 rounded-xl" />
    </div>
  );
}