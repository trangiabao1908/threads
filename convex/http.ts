import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { httpRouter } from "convex/server";

const http = httpRouter();
export const handleClerkWebhook = httpAction(async (ctx, request) => {
  const { data, type } = await request.json();
  console.log("Received data:", data);
  switch (type) {
    case "user.created":
      console.log("User created event received");
      await ctx.runMutation(internal.user.createUser, {
        clerkId: data.id,
        email: data.email_addresses[0]?.email_address || "",
        imageUrl: data.profile_image_url || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        username: data.username || null,
        followersCount: 0, // Default value
      });
      // Handle user created event
      break;
    case "user.updated":
      console.log("User updated event received");
      // Handle user updated event
      break;
    case "user.deleted":
      console.log("User deleted event received");
      // Handle user deleted event
      break;
    default:
      console.log("Unknown event type:", type);
  }
  return new Response(null, {
    status: 200,
  });
});
// https://striped-magpie-572.convex.site/clerk-users-webhook
http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: handleClerkWebhook,
});
// https://striped-magpie-572.convex.site
export default http;
