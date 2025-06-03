// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  fonts: {
    families: [{ name: "Inter", provider: "google" }, { name: "Roboto", provider: "google" }],
    processCSSVariables: true
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@nuxt/eslint', '@nuxt/image', "@nuxt/fonts"]
})