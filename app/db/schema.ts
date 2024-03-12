import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique(),
  ownerId: text("owner_id"),
});

export type Organization = typeof organizations.$inferSelect;

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  firstName: text("first_name"),
  organizationId: integer("organization_id"),
});

export type User = typeof users.$inferSelect;

export const organizationRelations = relations(
  organizations,
  ({ one, many }) => ({
    owner: one(users, {
      fields: [organizations.ownerId],
      references: [users.id],
    }),
    employees: many(users),
  }),
);

export const userRelations = relations(users, ({ one }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
}));

export const inviteTokens = pgTable("invite_tokens", {
  id: serial("id").primaryKey(),
  token: text("token").notNull(),
  iv: text("iv").notNull(),
  used: boolean("used").default(false),
});
