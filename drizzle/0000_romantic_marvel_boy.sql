CREATE TABLE `learning_states` (
	`user_id` text PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`mutation_id` text DEFAULT '' NOT NULL,
	`updated_at` integer NOT NULL
);
