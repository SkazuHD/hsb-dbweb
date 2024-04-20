import { createGlobPatternsForDependencies } from '@nx/angular/tailwind';
import { join } from 'path';

const config: import('tailwindcss').Config = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        custom_dark: '#17191C',
        custom_jet: '#313036',
        custom_red: '#A30800',
        custom_yellow: '#F6AE2D',
      },
      }
    },
  plugins: [],
};

export default config;
