// drizzle/schema/product-variant.ts
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  uniqueIndex,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { product } from './product';
import { design } from './design';

/**
 * A purchasable SKU belonging to a parent ProductTable row. variantId
 * stays non-nullable everywhere downstream: every product gets at least
 * one auto-created default variant even with no real options.
 */
export const productVariant = pgTable(
  'product_variant',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .notNull()
      .references(() => product.id, { onDelete: 'cascade' }),
    sku: varchar('sku', { length: 100 }).notNull(),
    netsuiteItemId: varchar('netsuite_item_id', { length: 100 }),
    label: varchar('label', { length: 255 }).notNull(), // "Default" if the product has no real variants

    attributes: jsonb('attributes')
      // .$type<Record<string, string>>()
      .notNull()
      .default({}),

    printingRules: jsonb('printing_rules')
      // .$type<PrintingRules>()
      .notNull()
      .default({}),

    printSpec: jsonb('print_spec'),
    // .$type<ProductSpec>(),

    images: varchar('images').array(),

    weightLbs: numeric('weight_lbs', { precision: 6, scale: 2 })
      .notNull()
      .default('0.00'),
    lengthInches: numeric('length_inches', { precision: 5, scale: 2 }),
    widthInches: numeric('width_inches', { precision: 5, scale: 2 }),
    heightInches: numeric('height_inches', { precision: 5, scale: 2 }),

    trackInventory: boolean('track_inventory').notNull().default(false),
    stockQuantity: integer('stock_quantity'),
    inStock: boolean('in_stock').notNull().default(true),

    isDefault: boolean('is_default').notNull().default(false),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    uniqueIndex('product_variants_sku_idx').on(t.sku),
    index('product_variants_product_idx').on(t.productId),

    index('product_variants_attributes_gin_idx').using('gin', t.attributes),
  ],
);

export const productVariantRelations = relations(
  productVariant,
  ({ one, many }) => ({
    product: one(product, {
      fields: [productVariant.productId],
      references: [product.id],
    }),
    userDesigns: many(design),
  }),
);
