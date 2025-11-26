// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_BASE_URL || 'https://api.example.com',
    },
  },
  fonts: {
    families: [{ name: "Inter", provider: "google" }, { name: "Roboto", provider: "google" }],
    processCSSVariables: true
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/eslint', '@nuxt/image', "@nuxt/fonts", "@pinia/nuxt", "nuxt-swiper"]
})