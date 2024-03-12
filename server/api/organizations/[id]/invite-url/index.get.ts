import { coerce, number, object, parseAsync } from "valibot";
import { db } from "~/app/db/drizzle-client";
import { inviteTokens } from "~/app/db/schema";
import { encrypt } from "~/app/invitation/token";

const paramsSchema = object({
  id: coerce(number(), (input: unknown) => Number(input)),
});

export default defineEventHandler(async (event) => {
  try {
    const { user } = await getUserSession(event);

    if (!user) {
      setResponseStatus(event, 401);
      return sendError(event, new Error("Unauthorized"));
    }

    const { id } = await getValidatedRouterParams(
      event,
      async (rawParams) => await parseAsync(paramsSchema, rawParams),
    );

    const organization = await db.query.organizations.findFirst({
      where: (orgs, { eq, and }) => {
        return and(eq(orgs.ownerId, user.id), eq(orgs.id, id));
      },
    });

    if (!organization) {
      setResponseStatus(event, 404);
      return sendError(event, new Error("Organization not found"));
    }

    const encryptedToken = encrypt(organization.id.toString());

    await db.insert(inviteTokens).values({
      iv: encryptedToken.iv,
      token: encryptedToken.content,
    });

    return `${process.env.NUXT_PUBLIC_BASE_URL!}/auth/google?state=${encryptedToken.content}`;
  } catch (e) {
    console.error("Error while getting invite url to organization:", e);
    setResponseStatus(event, 500);
    return sendError(event, new Error("Internal server error"));
  }
});
