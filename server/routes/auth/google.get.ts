import { parseAsync } from "valibot";
import { googleClaimsSchema } from "~/app/claims/google";
import { db } from "~/app/db/drizzle-client";
import { users } from "~/app/db/schema";

export default oauth.googleEventHandler({
  async onSuccess(event, { user }) {
    const parsedUser = await parseAsync(googleClaimsSchema, user);
    await db
      .insert(users)
      .values({ id: parsedUser.sub, firstName: parsedUser.name })
      .onConflictDoNothing();

    await setUserSession(event, {
      user: {
        id: parsedUser.sub,
        name: parsedUser.name,
      },
    });
    return sendRedirect(event, "/");
  },

  onError(event, error) {
    console.error("GitHub OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
