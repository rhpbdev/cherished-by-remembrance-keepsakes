// drizzle/schema/layout-template.ts
import {
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { product } from './product';
import { productVariant } from './product-variant';
import { designTemplate } from './design-template';
import type { DesignJson } from '@/features/designs/lib/validators';

/**
 * The abstract canvas structure for a variant — field positions, fonts,
 * photo bounds — WITHOUT a baked-in background image. Normally one row per
 * canonical variant (print dimensions differ per variant), but left
 * unpinned (variantId null) when every variant of the product shares the
 * same print spec — mirrors DesignTemplateTable's existing product-wide
 * convention (e.g. Tribute Bookmarks: 4 canonical variants, 1 shared print
 * spec, so one layout applies to all of them). Themes supply only the
 * background; DesignTemplateTable ties a (variant, theme) pair to a
 * layout, and lib/design/hydrate-canvas.ts composes the two into a full
 * DesignJson at read time. Verified against real data before this split:
 * every existing per-theme design_templates.fabric_config for a given
 * variant was byte-identical outside the background `clip` object.
 */
export const layoutTemplate = pgTable(
  'layout_template',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .notNull()
      .references(() => product.id, { onDelete: 'cascade' }),
    variantId: integer('variant_id').references(() => productVariant.id, {
      onDelete: 'set null',
    }),
    name: text('name').notNull(),
    // DesignJson shape, minus the background `clip` object per page.
    layoutConfig: jsonb('layout_config').$type<DesignJson>().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [index('layout_templates_variant_idx').on(t.variantId)],
);

export const layoutTemplateRelations = relations(
  layoutTemplate,
  ({ one, many }) => ({
    product: one(product, {
      fields: [layoutTemplate.productId],
      references: [product.id],
    }),
    variant: one(productVariant, {
      fields: [layoutTemplate.variantId],
      references: [productVariant.id],
    }),
    designTemplates: many(designTemplate),
  }),
);
