import { eq } from "drizzle-orm";
import { coerce, number, object, parseAsync } from "valibot";
import { db } from "~/app/db/drizzle-client";
import { organizations } from "~/app/db/schema";

const paramsSchema = object({
  id: coerce(number(), (input: unknown) => Number(input)),
});

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(
    event,
    async (rawParams) => await parseAsync(paramsSchema, rawParams),
  );
  const { user } = await getUserSession(event);

  if (!user) {
    setResponseStatus(event, 401);
    return sendError(event, new Error("Unauthorized"));
  }

  const organization = await db.query.organizations.findFirst({
    where: (orgs, { eq, and }) => {
      return and(eq(orgs.ownerId, user.id), eq(orgs.id, id));
    },
  });

  if (!organization) {
    setResponseStatus(event, 404);
    return sendError(event, new Error("Organization not found"));
  }

  return await db
    .delete(organizations)
    .where(eq(organizations.id, organization.id));
});
