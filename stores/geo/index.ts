import {defineStore} from 'pinia';
import type {City} from "~/repository/types/api/generatedApiGo";

type State = {
    geo: {
        city: string,
        popularCity: City[]
    }
}

export const useGeoStore = defineStore('Geo', {
    state: (): State => {
        return {
            geo: {
                city: "г. Санкт-Петербург",
                popularCity: [],
            }
        }
    },

    actions: {
        async loadGeo() {
            if (!import.meta.client) return;

            const {$api} = useNuxtApp();

            try {
                const storedCity = localStorage.getItem('geoCity');

                if (storedCity) {
                    this.geo.city = storedCity;
                } else {
                    // Иначе делаем API-запрос
                    const data = await $api.geo.getCityByIP();
                    this.geo.city = data.city || "г. Санкт-Петербург";
                    // Сохраняем в localStorage
                    localStorage.setItem('geoCity', data.city || "г. Санкт-Петербург");
                }
            } catch (error) {
                console.error('Ошибка загрузки геоданных:', error);
            }
        },


        async loadPopularCities() {
            if (!import.meta.client) return;

            const {$api} = useNuxtApp()
            try {
                this.geo.popularCity = await $api.geo.getPopularCity()
            } catch (error) {
                console.error('Error load geo data:', error);
            }
        },

        async findCity(cityName: string)    {
            const { $api } = useNuxtApp();
            try {
                this.geo.popularCity = await $api.geo.findCity(cityName)
            } catch (error) {
                console.error('Error finding city:', error);
            }
        },

        setCity(city: string) {
            localStorage.setItem('geoCity', city);
            this.geo.city = city;
        }
    },
});
