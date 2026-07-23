import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { menuCategorySchema } from './lib/menu.schema';

const menu = defineCollection({
  loader: glob({ pattern: '**/*.yaml', base: './src/content/menu' }),
  schema: menuCategorySchema,
});

export const collections = { menu };
