import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default createVuetify({
  theme: {
    defaultTheme: 'cinephixDark',
    themes: {
      cinephixDark: {
        dark: true,
        colors: {
          background:  '#080808',
          surface:     '#111111',
          primary:     '#e50914',
          secondary:   '#f5c518',
          accent:      '#04ff24',
          error:       '#f44336',
          info:        '#2196f3',
          success:     '#4caf50',
          warning:     '#ff9800',
          'on-primary': '#ffffff',
        },
      },
    },
  },
  defaults: {
    VBtn: {
      style: 'font-family: Inter, sans-serif; font-weight: 600; letter-spacing: 0.3px; text-transform: none;',
    },
    VCard: {
      style: 'background: #121212; border: 1px solid rgba(255,255,255,0.07);',
    },
    VList: {
      style: 'background: #111111;',
    },
    VChip: {
      style: 'font-family: Inter, sans-serif; font-weight: 600;',
    },
  },
})
