import { Id } from "@/convex/_generated/dataModel";

export type ProfileProps = {
  showBackButton?: boolean;
  userId?: Id<"users">;
  isLoading?: boolean;
};
