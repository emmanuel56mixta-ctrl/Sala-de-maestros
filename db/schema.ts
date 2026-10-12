import {sqliteTable,text,integer} from 'drizzle-orm/sqlite-core';
export const learningStates=sqliteTable('learning_states',{userId:text('user_id').primaryKey(),payload:text('payload').notNull(),revision:integer('revision').notNull().default(0),mutationId:text('mutation_id').notNull().default(''),updatedAt:integer('updated_at').notNull()});
