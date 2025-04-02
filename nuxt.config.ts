import { fileURLToPath } from 'url';

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  alias: {
    "@": fileURLToPath(new URL("./", import.meta.url)),
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use '@fortawesome/fontawesome-free/scss/fontawesome.scss';
            @use '@fortawesome/fontawesome-free/scss/solid.scss';
            @use '@fortawesome/fontawesome-free/scss/regular.scss';
            @use '@fortawesome/fontawesome-free/scss/brands.scss';
            @use '@/styles/_styles.scss' as *;
            @use '@/styles/colorVariables' as *;
            @use '@/styles/fonts' as *;
            @use '@/styles/externalVariables' as *;
          `
        }
      }
    },
    server: {
      allowedHosts: ['358a-191-99-49-39.ngrok-free.app']
    }
  },
  modules: [
    '@pinia/nuxt'
  ]
})