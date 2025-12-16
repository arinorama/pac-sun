import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Brand Colors
        brand: {
          black: '#000000',
          white: '#FFFFFF',
          red: '#E31837',
        },
        
        // Grayscale
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        
        // Semantic Colors
        success: {
          light: '#D1FAE5',
          DEFAULT: '#10B981',
          dark: '#065F46',
        },
        error: {
          light: '#FEE2E2',
          DEFAULT: '#EF4444',
          dark: '#991B1B',
        },
        warning: {
          light: '#FEF3C7',
          DEFAULT: '#F59E0B',
          dark: '#92400E',
        },
        info: {
          light: '#DBEAFE',
          DEFAULT: '#3B82F6',
          dark: '#1E40AF',
        },
        
        // UI Colors
        background: {
          DEFAULT: '#FFFFFF',
          subtle: '#F9FAFB',
          muted: '#F3F4F6',
        },
        foreground: {
          DEFAULT: '#111827',
          subtle: '#6B7280',
          muted: '#9CA3AF',
        },
        border: {
          DEFAULT: '#E5E7EB',
          subtle: '#F3F4F6',
        },
        
        // Interactive States
        hover: {
          DEFAULT: '#F3F4F6',
        },
        active: {
          DEFAULT: '#E5E7EB',
        },
        focus: {
          DEFAULT: '#3B82F6',
          ring: 'rgba(59, 130, 246, 0.5)',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

