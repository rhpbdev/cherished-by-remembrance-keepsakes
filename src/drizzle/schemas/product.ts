import {
  boolean,
  decimal,
  integer,
  pgTable,
  serial,
  text,
  uniqueIndex,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productVariant } from './product-variant';
import { designTemplate } from './design-template';
// import { review } from './review';

export const product = pgTable(
  'product',
  {
    id: serial('id').primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull(),
    name: text('name').notNull(), // "Gradfold Booklet", "Prayer Card"
    description: text('description').notNull().default(''),

    category: varchar('category', { length: 120 }).notNull(),
    brand: varchar('brand', { length: 120 }).notNull().default('CFMemories'),

    images: varchar('images').array().notNull().default([]),

    isFeatured: boolean('is_featured').notNull().default(false),
    banner: varchar('banner'),
    rating: decimal('rating', { precision: 3, scale: 2 })
      .$type<string>()
      .notNull()
      .default('0'),
    numReviews: integer('num_reviews').notNull().default(0),

    isActive: boolean('is_active').notNull().default(true),

    displayOrder: integer('display_order').notNull().default(999),

    shipsInSeparateBox: boolean('ships_in_separate_box')
      .notNull()
      .default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [uniqueIndex('products_slug_idx').on(t.slug)],
);

export const productRelations = relations(product, ({ many }) => ({
  variants: many(productVariant),
  designTemplates: many(designTemplate),
  // reviews: many(review),
}));
