import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";


export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  credits: integer("credits").default(1000).notNull()
});

export const userrepositories = pgTable("user_repos", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  repoId: integer("repo_id").notNull(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  htmlUrl: text("html_url").notNull(),
  description: text("description"),
  language: text("language"),
  owner: text("owner").notNull(),
  private: integer("private").default(0).notNull(),
  active: boolean("active").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),

});


export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
