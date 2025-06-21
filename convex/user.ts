import { v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";
import { Id } from "./_generated/dataModel";

//

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    first_name: v.optional(v.string()),
    last_name: v.optional(v.string()),
    username: v.union(v.string(), v.null()),
    bio: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    followersCount: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      ...args,
      username: args.username || `${args.first_name}${args.last_name}`,
    });
    return userId;
  },
});

export const getUserByCLerkId = query({
  args: { clerkId: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();
    if (!user?.imageUrl || user?.imageUrl.startsWith("http")) {
      return user;
    }
    const newImageUrl = await ctx.storage.getUrl(
      user.imageUrl as Id<"_storage">
    );
    return {
      ...user,
      imageUrl: newImageUrl,
    };
  },
});
export const getUserById = query({
  args: { userid: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userid);
    if (!user?.imageUrl || user?.imageUrl.startsWith("http")) {
      return user;
    }
    const newImageUrl = await ctx.storage.getUrl(
      user.imageUrl as Id<"_storage">
    );
    return {
      ...user,
      imageUrl: newImageUrl,
    };
  },
});

export const updateUser = mutation({
  args: {
    _id: v.id("users"),
    websiteUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    bio: v.optional(v.string()),
    pushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await getCurrentUserOrThrow(ctx);
    return await ctx.db.patch(args._id, args);
  },
});

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byClerkId", (q) => q.eq("clerkId", externalId))
    .unique();
}

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    // Ensure the user is authenticated
    await getCurrentUserOrThrow(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});
