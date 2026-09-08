// drizzle/schema/theme.ts
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { designTemplate } from './design-template';

export type ThemeBackgrounds = Record<string, string>;

export const theme = pgTable(
  'theme',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 120 }).notNull(),
    name: text('name').notNull(),
    description: text('description'),

    category: varchar('category', { length: 120 }),
    tags: varchar('tags').array(),
    previewImage: text('preview_image'),

    backgrounds: jsonb('backgrounds').$type<ThemeBackgrounds>(),
    isActive: boolean('is_active').notNull().default(true),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [uniqueIndex('themes_slug_idx').on(t.slug)],
);

export const themeRelations = relations(theme, ({ many }) => ({
  templates: many(designTemplate),
}));
