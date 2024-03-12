CREATE TABLE IF NOT EXISTS "invite_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text,
	"iv" text,
	"used" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"owner_id" text,
	CONSTRAINT "organizations_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text,
	"organization_id" integer
);
