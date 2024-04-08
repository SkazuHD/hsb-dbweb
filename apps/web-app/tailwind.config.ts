import { createGlobPatternsForDependencies } from '@nx/angular/tailwind';
import { join } from 'path';

const config: import('tailwindcss').Config = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
