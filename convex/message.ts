import { Id } from "./_generated/dataModel.d";
import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getCurrentUserOrThrow } from "./user";
import { paginationOptsValidator, Query } from "convex/server";

export const generateMessage = mutation({
  args: {
    content: v.string(),
    threadId: v.optional(v.id("messages")),
    mediaFiles: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    const message = await ctx.db.insert("messages", {
      ...args,
      userId: user._id,
      likeCount: 0,
      commentCount: 0,
      retweetCount: 0,
    });
    return message;
  },
});
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx, args) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getThreads = query({
  args: {
    paginationOpts: paginationOptsValidator,
    userId: v.optional(v.id("users")),
    refreshKey: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let threads;
    if (args.userId) {
      threads = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("userId"), args.userId))
        .order("desc")
        .paginate(args.paginationOpts!);
    } else {
      threads = await ctx.db
        .query("messages")
        .filter((q) => q.eq(q.field("threadId"), undefined))
        .order("desc")
        .paginate(args.paginationOpts!);
    }
    const threadsWithCreators = await Promise.all(
      threads.page.map(async (thread) => {
        const creator = await getMessageCreator(ctx, thread.userId);
        const mediaUrls = await getMediaUrls(ctx, thread.mediaFiles);
        return {
          ...thread,
          creator,
          mediaFiles: mediaUrls,
        };
      })
    );
    return {
      ...threads,
      page: threadsWithCreators,
    };
  },
});
export const getMessageCreator = async (ctx: QueryCtx, userId: Id<"users">) => {
  const user = await ctx.db.get(userId);
  if (!user?.imageUrl || user?.imageUrl.startsWith("http")) {
    return user;
  }
  const newImageUrl = await ctx.storage.getUrl(user.imageUrl as Id<"_storage">);
  return {
    ...user,
    imageUrl: newImageUrl,
  };
};
export const getMediaUrls = async (
  ctx: QueryCtx,
  mediaFiles: string[] | undefined
) => {
  if (!mediaFiles || mediaFiles.length === 0) {
    return [];
  }
  const mediaUrls = await Promise.all(
    mediaFiles.map(async (file) => {
      if (file.startsWith("http")) {
        return file;
      }
      return await ctx.storage.getUrl(file as Id<"_storage">);
    })
  );
  return mediaUrls;
};
export const likeThread = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);
    const message = await ctx.db.get(args.messageId);
    if (!message) {
      throw new Error("Message not found");
    }
    return await ctx.db.patch(args.messageId, {
      likeCount: message.likeCount ? message.likeCount + 1 : 1,
    });
  },
});
