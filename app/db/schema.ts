import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  varchar,
  smallint,
} from "drizzle-orm/pg-core";

export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: varchar("name").unique(),
  ownerId: text("owner_id"),
});

export type Organization = typeof organizations.$inferSelect;

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
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

export const recruitmentProcess = pgTable("recruitment_process", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  recruiterId: text("recruiter_id").notNull(),
});

export const recruitmentProcessRelations = relations(
  recruitmentProcess,
  ({ one, many }) => ({
    recruiter: one(users, {
      fields: [recruitmentProcess.recruiterId],
      references: [users.id],
    }),
    steps: many(recruitmentStep),
  }),
);

export const recruitmentStepType = pgEnum("recruitment_step_type", [
  "call",
  "home_task",
  "feedback",
]);

export const recruitmentStep = pgTable("recruitment_step", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  processId: integer("process_id").notNull(),
  type: recruitmentStepType("type").notNull(),
  order: smallint("order").notNull(),
});

export const recruitmentStepRelations = relations(
  recruitmentStep,
  ({ one }) => ({
    recruitmentProcess: one(recruitmentProcess, {
      fields: [recruitmentStep.processId],
      references: [recruitmentProcess.id],
    }),
  }),
);
