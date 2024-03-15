import { db } from "~/app/db/drizzle-client";
import { users } from "~/app/db/schema";
import { parseAsync } from "valibot";
import { githubClaimsSchema } from "~/app/auth/claims/github";

export default oauth.githubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    try {
      const parsedUser = await parseAsync(githubClaimsSchema, user);
      await db
        .insert(users)
        .values({ id: parsedUser.id.toString(), firstName: parsedUser.name })
        .onConflictDoNothing();

      await setUserSession(event, {
        user: {
          id: parsedUser.id.toString(),
          name: parsedUser.name,
        },
      });
      return sendRedirect(event, "/");
    } catch (error) {
      console.error("Error while handling GitHub OAuth success:", error);
      return sendRedirect(event, "/");
    }
  },

  onError(event, error) {
    console.error("GitHub OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
