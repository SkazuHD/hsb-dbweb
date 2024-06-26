import { createGlobPatternsForDependencies } from '@nx/angular/tailwind';
import { join } from 'path';

const config: import('tailwindcss').Config = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        custom_dark: '#17191C',
        custom_white: '#fafdfc',
        custom_jet: '#313036',
        custom_red: '#A30800',
        custom_yellow: '#F6AE2D',
      },
      animation: {
        'ping-once': 'ping 300ms ease-out 1 reverse',
      },
      screens: {
        xs: '540px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
  ],
};

export default config;
