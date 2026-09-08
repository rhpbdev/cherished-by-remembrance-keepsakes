import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid, date } from 'drizzle-orm/pg-core';
import { user, organization } from './auth';
import { design } from './design';

export const project = pgTable('project', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuid_generate_v7()`),
  deceasedName: text('deceased_name').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').references(() => organization.id, {
    onDelete: 'restrict',
  }),
  dateOfBirth: date('date_of_birth'),
  dateOfDeath: date('date_of_death'),
  obituaryContent: text('obituary_content').notNull().default(''),
  funeralHomeName: text('funeral_home_name').notNull().default(''),
  funeralHomeAddress: text('funeral_home_address').notNull().default(''),
  servicePlaceName: text('service_place_name').notNull().default(''),
  serviceAddress: text('service_address').notNull().default(''),
  serviceCity: text('service_city').notNull().default(''),
  serviceState: text('service_state').notNull().default(''),
  serviceZip: text('service_zip').notNull().default(''),
  serviceDate: date('service_date'),
  serviceTime: text('service_time').notNull().default(''),
  mainFrontPhotoUrl: text('main_front_photo_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [project.organizationId],
    references: [organization.id],
  }),
  designs: many(design),
}));
