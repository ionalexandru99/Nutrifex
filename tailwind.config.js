/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Design tokens - use CSS variables for dynamic theming
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        primary: 'rgb(var(--primary) / <alpha-value>)',
        primaryForeground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        mutedForeground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
      },
    },
  },
  plugins: [
    // Default values (light theme fallback)
    ({ addBase }) =>
      addBase({
        ':root': {
          '--background': '245 245 245',
          '--foreground': '17 24 28',
          '--primary': '10 126 164',
          '--primary-foreground': '255 255 255',
          '--muted': '156 163 175',
          '--muted-foreground': '107 114 128',
          '--border': '229 231 235',
          '--accent': '129 199 132',
        },
      }),
  ],
};
