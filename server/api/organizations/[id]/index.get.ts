import { coerce, number, object, parseAsync } from "valibot";
import { db } from "~/app/db/drizzle-client";

const paramsSchema = object({
  id: coerce(number(), (input: unknown) => Number(input)),
});

export default defineEventHandler(async (event) => {
  try {
    const { id } = await getValidatedRouterParams(
      event,
      async (rawParams) => await parseAsync(paramsSchema, rawParams),
    );

    const { user } = await getUserSession(event);

    if (!user) {
      setResponseStatus(event, 401);
      return sendError(event, new Error("Unauthorized"));
    }

    const foundUser = await db.query.users.findFirst({
      where: (users, { eq, and }) => {
        return and(eq(users.id, user.id), eq(users.organizationId, id));
      },
    });

    if (!foundUser) {
      setResponseStatus(event, 404);
      return sendError(event, new Error("User not found"));
    }

    const organization = await db.query.organizations.findFirst({
      where: (orgs, { eq }) => {
        return eq(orgs.id, id);
      },
    });

    if (!organization) {
      setResponseStatus(event, 404);
      return sendError(event, new Error("Organization not found"));
    }

    return organization;
  } catch (e) {
    console.error("Error while getting organization:", e);
    setResponseStatus(event, 500);
    return sendError(event, new Error("Internal server error"));
  }
});
