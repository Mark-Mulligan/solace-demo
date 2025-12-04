import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  jsonb,
  serial,
  timestamp,
  bigint,
} from "drizzle-orm/pg-core";

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

const advocateSpecialties = pgTable("advocate_specialties", {
  id: serial("id").primaryKey(),
  advocateId: integer("advocate_id")
    .notNull()
    .references(() => advocates.id),
  specialtyId: integer("specialty_id")
    .notNull()
    .references(() => specialties.id),
});

export type Advocate = typeof advocates.$inferSelect;
export { advocates, specialties, advocateSpecialties };
