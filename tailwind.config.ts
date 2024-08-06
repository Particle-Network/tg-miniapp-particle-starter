import { nextui } from '@nextui-org/react';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      addCommonColors: true,
      defaultTheme: 'light',
      defaultExtendTheme: 'light',
      themes: {
        light: {
          extend: 'light',
          colors: {
            primary: {
              50: '#F9FAFB',
              100: '#EDEFFB',
              200: '#DAD4F8',
              300: '#DCABFF',
              400: '#A485E3',
              500: '#B052FF',
              600: '#7344C9',
              700: '#582980',
              800: '#3C2377',
              900: '#2A1B4C',
              DEFAULT: '#B052FF',
              foreground: '#FFFFFF',
            },
          },
        },
      },
    }),
  ],
};
export default config;