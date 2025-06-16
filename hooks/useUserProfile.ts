import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";

export const useUserProfile = () => {
  const { user } = useUser();
  const userProfile = useQuery(api.user.getUserByCLerkId, {
    clerkId: user?.id,
  });
  return {
    userProfile,
  };
};
