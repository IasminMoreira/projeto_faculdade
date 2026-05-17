/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Coral (primária — energia, CTA, coração) ──
        coral: {
          50:  '#fff4f1',
          100: '#ffe4dc',
          200: '#ffc9b8',
          300: '#ffa38e',
          400: '#ff7a5c',
          500: '#e85d3e',  // base
          600: '#c4674e',  // logo coral
          700: '#a04030',
          800: '#7d2e1e',
          900: '#5a1e10',
        },
        // ── Verde (secundária — natureza, confiança) ──
        verde: {
          50:  '#f0f9f4',
          100: '#d6f0e3',
          200: '#aadfc8',
          300: '#72c8a8',
          400: '#3dae87',
          500: '#2a9470',  // base
          600: '#3d8068',  // logo verde
          700: '#1f6650',
          800: '#154d3c',
          900: '#0d3328',
        },
        // ── Neutros quentes (fundo, superfícies) ──
        creme: {
          50:  '#fffdf9',
          100: '#fdf6ed',
          200: '#f8ece0',
          300: '#f0dfd0',
          400: '#e5cfc0',
          500: '#d4bfb0',
        },
        // ── Semantic ──
        surface:    '#fffdf9',
        'surface-2': '#fdf6ed',
        'surface-3': '#f8ece0',
        'on-surface': '#2d1f1a',
        'on-surface-muted': '#7a5e55',
        border:     '#e5cfc0',
        'border-strong': '#c4a898',
        error:      '#c0392b',
        'error-light': '#fdecea',
        success:    '#2a9470',
        'success-light': '#d6f0e3',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        'display': ['48px', { lineHeight: '1.1', fontWeight: '800' }],
        'h1':      ['36px', { lineHeight: '1.15', fontWeight: '700' }],
        'h2':      ['28px', { lineHeight: '1.25', fontWeight: '700' }],
        'h3':      ['22px', { lineHeight: '1.3', fontWeight: '600' }],
        'h4':      ['18px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['17px', { lineHeight: '1.65', fontWeight: '400' }],
        'body':    ['15px', { lineHeight: '1.65', fontWeight: '400' }],
        'sm':      ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'label':   ['12px', { lineHeight: '1.2', letterSpacing: '0.06em', fontWeight: '600' }],
      },
      borderRadius: {
        'xs':  '6px',
        'sm':  '10px',
        'md':  '14px',
        'lg':  '20px',
        'xl':  '28px',
        '2xl': '36px',
        'pill':'9999px',
      },
      spacing: {
        'xs':  '4px',
        'sm':  '8px',
        'md':  '16px',
        'lg':  '24px',
        'xl':  '32px',
        'xxl': '48px',
        '3xl': '64px',
      },
      boxShadow: {
        'soft':   '0 2px 12px 0 rgba(196,103,78,0.10)',
        'card':   '0 4px 24px -4px rgba(196,103,78,0.14)',
        'lifted': '0 8px 32px -6px rgba(196,103,78,0.20)',
        'nav':    '0 -4px 24px 0 rgba(45,31,26,0.08)',
        'glow-coral': '0 0 0 3px rgba(232,93,62,0.25)',
        'glow-verde': '0 0 0 3px rgba(61,128,104,0.25)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #fff4f1 0%, #f0f9f4 100%)',
        'gradient-coral': 'linear-gradient(135deg, #e85d3e 0%, #c4674e 100%)',
        'gradient-verde': 'linear-gradient(135deg, #3d8068 0%, #2a9470 100%)',
        'gradient-warm':  'linear-gradient(180deg, #fffdf9 0%, #fdf6ed 100%)',
        'mesh': `radial-gradient(at 0% 0%, rgba(232,93,62,0.08) 0px, transparent 60%),
                 radial-gradient(at 100% 100%, rgba(61,128,104,0.08) 0px, transparent 60%)`,
      },
    },
  },
  plugins: [],
}
