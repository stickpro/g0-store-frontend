// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-01-30',
    future: {
        compatibilityVersion: 4,
    },
    devtools: {enabled: true},
    css: ['~/assets/css/main.css'],
    runtimeConfig: {
        public: {
            apiUrl: process.env.API_BASE_URL || 'https://api.example.com',
            storageUrl: process.env.STORAGE_URL || 'https://api.example.com',
            yandexMapsApiKey: process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY || '',
        }
    },
    fonts: {
        families: [
            {
                name: "Inter",
                provider: "google",
                weights: [400, 500, 600, 700, 800, 900]
            },
            {
                name: "Roboto",
                provider: "google",
                weights: [400, 500, 700]
            }
        ],
        processCSSVariables: true
    },

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    modules: ['@nuxt/eslint', '@nuxt/image', "@nuxt/fonts", "@pinia/nuxt", "nuxt-swiper", "vue-yandex-maps/nuxt"],
    yandexMaps: {
        apikey: process.env.NUXT_PUBLIC_YANDEX_MAPS_API_KEY || '',
    }
})
