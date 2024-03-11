import { number, object, parseAsync } from "valibot";
import { db } from "~/app/db/drizzle-client";

const paramsSchema = object({
  id: number(),
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

  return organization;
});
