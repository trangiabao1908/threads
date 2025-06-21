import { Doc } from "./../convex/_generated/dataModel.d";
export type ThreadType = {
  thread: Doc<"messages"> & {
    creator: Doc<"users">;
  };
};
