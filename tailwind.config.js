/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,scss}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0057FF',
          dark:    '#00205C',
          deep:    '#001133',
          light:   '#EEF4FF',
          hover:   '#0048D4',
        },
        accent: {
          cyan:    '#00C8F0',
          red:     '#FF2D46',
          gold:    '#FFBE00',
          green:   '#00C48C',
          purple:  '#7C3AED',
        },
        ftn: {
          bg:      '#F5F6F8',
          surface: '#ECEEF2',
          border:  '#DDE1EA',
          muted:   '#5B6880',
          dark:    '#0D1117',
          navy:    '#051640',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient':   'linear-gradient(135deg, #00205C 0%, #0057FF 55%, #00C8F0 100%)',
        'card-shine':      'linear-gradient(135deg, rgba(255,255,255,.1) 0%, rgba(255,255,255,0) 60%)',
        'gold-gradient':   'linear-gradient(135deg, #FFBE00, #FF8C00)',
        'silver-gradient': 'linear-gradient(135deg, #9CA3AF, #6B7280)',
        'bronze-gradient': 'linear-gradient(135deg, #D97706, #92400E)',
        'blue-cyan':       'linear-gradient(135deg, #0057FF, #00C8F0)',
      },
      boxShadow: {
        'card':         '0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)',
        'card-hover':   '0 16px 48px rgba(0,87,255,.18), 0 4px 16px rgba(0,87,255,.08)',
        'card-lift':    '0 8px 24px rgba(0,0,0,.10), 0 2px 8px rgba(0,0,0,.06)',
        'btn':          '0 4px 14px rgba(0,87,255,.40)',
        'btn-red':      '0 4px 14px rgba(255,45,70,.40)',
        'btn-green':    '0 4px 14px rgba(0,196,140,.40)',
        'glow-blue':    '0 0 28px rgba(0,87,255,.35)',
        'glow-cyan':    '0 0 28px rgba(0,200,240,.30)',
        'glow-gold':    '0 0 24px rgba(255,190,0,.45)',
        'nav':          '0 8px 32px rgba(0,17,51,.45)',
        'podium':       '0 8px 32px rgba(0,0,0,.14)',
        'inner-glow':   'inset 0 1px 0 rgba(255,255,255,.08)',
      },
      borderRadius: {
        DEFAULT: '10px',
        sm:  '6px',
        md:  '10px',
        lg:  '16px',
        xl:  '20px',
        '2xl': '24px',
        pill: '999px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-up':     'fadeUp .55s cubic-bezier(.22,.68,0,1.2) both',
        'fade-in':     'fadeIn .35s ease both',
        'slide-up':    'slideUp .4s ease both',
        'float':       'float 4s ease-in-out infinite',
        'shimmer':     'shimmerAnim 2s linear infinite',
        'pulse-slow':  'pulse 3s ease-in-out infinite',
        'spin-slow':   'spin 3s linear infinite',
        'bounce-dot':  'bounceDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmerAnim: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(1)', opacity: '1' },
          '40%':           { transform: 'scale(1.5)', opacity: '.8' },
        },
      },
    },
  },
  corePlugins: { preflight: false },
  plugins: [],
}
