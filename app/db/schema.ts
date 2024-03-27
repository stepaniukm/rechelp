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
  jsonb,
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

export type InviteToken = typeof inviteTokens.$inferSelect;

export const recruitmentProcess = pgTable("recruitment_processes", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  recruiterId: text("recruiter_id").notNull(),
});

export type RecruitmentProcess = typeof recruitmentProcess.$inferSelect;

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

export type RecruitmentStepType =
  (typeof recruitmentStepType.enumValues)[number];

export const recruitmentStep = pgTable("recruitment_steps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  processId: integer("process_id").notNull(),
  type: recruitmentStepType("type").notNull(),
  order: smallint("order").notNull(),
});

export type RecruitmentStep = typeof recruitmentStep.$inferSelect;

export const recruitmentStepRelations = relations(
  recruitmentStep,
  ({ one }) => ({
    recruitmentProcess: one(recruitmentProcess, {
      fields: [recruitmentStep.processId],
      references: [recruitmentProcess.id],
    }),
  }),
);

export const deck = pgTable("decks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  organizationId: integer("organization_id").notNull(),
});

export type Deck = typeof deck.$inferSelect;

export const deckRelations = relations(deck, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [deck.organizationId],
    references: [organizations.id],
  }),
  questions: many(question),
}));

export const questionType = pgEnum("question_type", [
  "text",
  "choice",
  "multiple_choice",
]);

export type QuestionType = (typeof questionType.enumValues)[number];

export const question = pgTable("questions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: questionType("type").notNull(),
  options: jsonb("options"),
  correctOption: integer("correct_option"),
  correctAnswer: text("correct_answer"),

  deckId: integer("deck_id").notNull(),
  organizationId: integer("organization_id").notNull(),
});

export type Question = typeof question.$inferSelect;

export const questionRelations = relations(question, ({ one }) => ({
  deck: one(deck, {
    fields: [question.deckId],
    references: [deck.id],
  }),
}));
