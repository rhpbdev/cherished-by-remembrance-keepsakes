import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uuid,
  pgEnum,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import type { DesignJson } from '@/features/designs/lib/validators';
import { project } from './project';
import { product } from './product';
import { productVariant } from './product-variant';
import { theme } from './theme';

export const designStatusEnum = pgEnum('design_status', [
  'draft',
  'ready',
  'ordered',
  'archived',
]);

export const design = pgTable(
  'design',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuid_generate_v7()`),
    projectId: uuid('project_id')
      .notNull()
      .references(() => project.id),
    productId: integer('product_id')
      .notNull()
      .references(() => product.id),
    variantId: integer('variant_id')
      .notNull()
      .references(() => productVariant.id),

    themeId: integer('theme_id').references(() => theme.id, {
      onDelete: 'set null',
    }),
    name: text('name').notNull().default('My Custom Design'),
    status: designStatusEnum('status').notNull().default('draft'),

    quantity: integer('quantity').notNull().default(1),
    canvasState: jsonb('canvas_state').$type<DesignJson>().notNull(),
    previewUrl: text('preview_url'), // thumbnail snapshot for cart/checkout display
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [
    index('user_designs_project_idx').on(t.projectId),
    index('user_designs_product_idx').on(t.productId),
    index('user_designs_variant_idx').on(t.variantId),
    index('user_designs_theme_idx').on(t.themeId),
  ],
);

export const designRelations = relations(design, ({ one }) => ({
  project: one(project, {
    fields: [design.projectId],
    references: [project.id],
  }),
  product: one(product, {
    fields: [design.productId],
    references: [product.id],
  }),
  variant: one(productVariant, {
    fields: [design.variantId],
    references: [productVariant.id],
  }),
  theme: one(theme, {
    fields: [design.themeId],
    references: [theme.id],
  }),
}));
