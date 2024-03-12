import { eq } from "drizzle-orm";
import { object, optional, parseAsync, string } from "valibot";
import { googleEventHandler } from "~/app/auth/handlers/google";
import { googleClaimsSchema } from "~/app/claims/google";
import { db } from "~/app/db/drizzle-client";
import { inviteTokens, users } from "~/app/db/schema";
import { decrypt } from "~/app/invitation/token";

export default googleEventHandler({
  async onSuccess(event, { user }) {
    const { state } = await getValidatedQuery(
      event,
      async (rawQuery) =>
        await parseAsync(
          object({
            state: optional(string()),
          }),
          rawQuery,
        ),
    );
    const parsedUser = await parseAsync(googleClaimsSchema, user);
    await db
      .insert(users)
      .values({ id: parsedUser.sub, firstName: parsedUser.name })
      .onConflictDoNothing();

    if (state) {
      const inviteTokenResult = await db.query.inviteTokens.findFirst({
        where(tokens, { eq, and }) {
          return and(eq(tokens.token, state), eq(tokens.used, false));
        },
      });

      if (inviteTokenResult) {
        const { iv, token } = inviteTokenResult;
        const organizationId = Number(decrypt({ iv, content: token }));

        await db.transaction(async (tdb) => {
          await tdb
            .update(users)
            .set({
              organizationId,
            })
            .where(eq(users.id, parsedUser.sub));

          await tdb
            .update(inviteTokens)
            .set({ used: true })
            .where(eq(inviteTokens.token, state));
        });
      } else {
        console.error("Invalid invite token");
      }
    }

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
