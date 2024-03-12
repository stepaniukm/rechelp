import { eq } from "drizzle-orm";
import { coerce, number, object, parseAsync, string } from "valibot";
import { db } from "~/app/db/drizzle-client";
import { organizations } from "~/app/db/schema";

const bodySchema = object({
  name: string(),
});

const paramsSchema = object({
  id: coerce(number(), (input: unknown) => Number(input)),
});

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedRouterParams(
    event,
    async (rawParams) => await parseAsync(paramsSchema, rawParams),
  );
  const updateOrganization = await readValidatedBody(
    event,
    async (rawBody) => await parseAsync(bodySchema, rawBody),
  );
  const { user } = await getUserSession(event);

  if (!user) {
    setResponseStatus(event, 401);
    return sendError(event, new Error("Unauthorized"));
  }

  try {
    await db
      .update(organizations)
      .set({
        name: updateOrganization.name,
      })
      .where(eq(organizations.id, id));
    setResponseStatus(event, 203);
    return {
      status: "success",
    };
  } catch (error) {
    console.error("Error while creating organization:", error);
    setResponseStatus(event, 500);
    return sendError(event, new Error("Internal server error"));
  }
});
