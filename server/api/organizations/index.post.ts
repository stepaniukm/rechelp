import { eq } from "drizzle-orm";
import { object, parseAsync, string } from "valibot";
import { db } from "~/app/db/drizzle-client";
import { organizations, users } from "~/app/db/schema";

const bodySchema = object({
  name: string(),
});

export default defineEventHandler(async (event) => {
  const createOrganization = await readValidatedBody(
    event,
    async (rawBody) => await parseAsync(bodySchema, rawBody),
  );
  const { user } = await getUserSession(event);

  if (!user) {
    setResponseStatus(event, 401);
    return sendError(event, new Error("Unauthorized"));
  }

  try {
    const created = await db.transaction(async (tdb) => {
      const foundUser = await tdb.query.users.findFirst({
        where(users, { eq }) {
          return eq(users.id, user.id);
        },
      });

      if (foundUser?.organizationId) {
        setResponseStatus(event, 403);
        return sendError(event, new Error("User already has an organization"));
      }

      const created = await tdb
        .insert(organizations)
        .values({
          name: createOrganization.name,
          ownerId: user.id,
        })
        .returning({ id: organizations.id });

      await tdb
        .update(users)
        .set({
          organizationId: created[0].id,
        })
        .where(eq(users.id, user.id));

      return created;
    });

    setResponseStatus(event, 203);
    return created;
  } catch (error) {
    console.error("Error while creating organization:", error);
    setResponseStatus(event, 500);
    return sendError(event, new Error("Internal server error"));
  }
});
