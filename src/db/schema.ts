import { pgTable, serial, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

// Testimonials Table
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  text: text("text").notNull(),
  role: varchar("role", { length: 255 }).notNull(), // e.g. "Student, University of Oxford"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Services Table
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 100 }), // FontAwesome icon class or Lucide icon name
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Blogs Table
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  image: varchar("image", { length: 500 }), // URL or path
  tag: varchar("tag", { length: 100 }),
  readTime: varchar("read_time", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Contact Inquiries Table
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  qualification: varchar("qualification", { length: 100 }).notNull(),
  service: varchar("service", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isContacted: boolean("is_contacted").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Site Content Table for CMS
export const siteContent = pgTable("site_content", {
  key: varchar("key", { length: 255 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
