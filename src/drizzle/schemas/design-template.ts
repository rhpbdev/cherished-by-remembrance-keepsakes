import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { product } from './product';
import { productVariant } from './product-variant';
import { theme } from './theme';
import { layoutTemplate } from './layout-template';
import type { DesignJson } from '@/features/designs/lib/validators';

export const designTemplate = pgTable(
  'design_template',
  {
    id: serial('id').primaryKey(),
    productId: integer('product_id')
      .notNull()
      .references(() => product.id, { onDelete: 'cascade' }),
    variantId: integer('variant_id').references(() => productVariant.id, {
      onDelete: 'set null',
    }),
    themeId: integer('theme_id')
      .notNull()
      .references(() => theme.id, { onDelete: 'cascade' }),
    layoutTemplateId: integer('layout_template_id')
      .notNull()
      .references(() => layoutTemplate.id, { onDelete: 'restrict' }),

    configOverrides: jsonb('config_overrides').$type<Partial<DesignJson>>(),

    previewImage: text('preview_image'),
    isDefault: boolean('is_default').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    index('design_templates_product_idx').on(t.productId),
    index('design_templates_theme_idx').on(t.themeId),
    uniqueIndex('design_templates_product_variant_theme_idx').on(
      t.productId,
      t.variantId,
      t.themeId,
    ),
  ],
);

export const designTemplateRelations = relations(designTemplate, ({ one }) => ({
  product: one(product, {
    fields: [designTemplate.productId],
    references: [product.id],
  }),
  variant: one(productVariant, {
    fields: [designTemplate.variantId],
    references: [productVariant.id],
  }),
  theme: one(theme, {
    fields: [designTemplate.themeId],
    references: [theme.id],
  }),
  layoutTemplate: one(layoutTemplate, {
    fields: [designTemplate.layoutTemplateId],
    references: [layoutTemplate.id],
  }),
}));
