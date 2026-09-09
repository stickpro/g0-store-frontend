import {defineStore} from 'pinia';
import type {CityResponse} from "~/repository/types/api/generatedApiGo";

const GEO_CITY_STORAGE_KEY = 'geoCity';
const DEFAULT_CITY_LABEL = 'г. Санкт-Петербург';
/** [longitude, latitude] — fallback when city has no geo fields yet */
const DEFAULT_CITY_COORDINATES: [number, number] = [30.347328, 59.929316];

function hasCityCoordinates(city?: CityResponse | null) {
    const lat = Number(city?.geo_lat);
    const lon = Number(city?.geo_lon);
    return Number.isFinite(lat) && Number.isFinite(lon);
}

export function cityLabel(city?: CityResponse | null): string {
    if (!city) return DEFAULT_CITY_LABEL;
    if (city.address) return city.address;
    if (city.city) {
        return city.city_type ? `${city.city_type}. ${city.city}` : city.city;
    }
    if (city.settlement) {
        return city.settlement_type ? `${city.settlement_type}. ${city.settlement}` : city.settlement;
    }
    return DEFAULT_CITY_LABEL;
}

function parseStoredCity(raw: string | null): CityResponse | null {
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as CityResponse | string;
        if (parsed && typeof parsed === 'object') return parsed;
        if (typeof parsed === 'string' && parsed) return { address: parsed, city: parsed };
    } catch {
        return { address: raw, city: raw };
    }
    return null;
}

type State = {
    geo: {
        city: string,
        cityData: CityResponse | null,
        popularCity: CityResponse[]
    },
    isModalOpen: boolean
}

export const useGeoStore = defineStore('Geo', {
    state: (): State => {
        return {
            geo: {
                city: DEFAULT_CITY_LABEL,
                cityData: null,
                popularCity: [],
            },
            isModalOpen: false
        }
    },

    getters: {
        cityCoordinates(): [number, number] {
            const lat = Number(this.geo.cityData?.geo_lat);
            const lon = Number(this.geo.cityData?.geo_lon);
            if (Number.isFinite(lat) && Number.isFinite(lon)) {
                return [lon, lat];
            }
            return DEFAULT_CITY_COORDINATES;
        },
    },

    actions: {
        persistCity(city: CityResponse) {
            this.geo.cityData = city;
            this.geo.city = cityLabel(city);
            localStorage.setItem(GEO_CITY_STORAGE_KEY, JSON.stringify(city));
        },

        async loadGeo() {
            if (!import.meta.client) return;

            const {$api} = useNuxtApp();

            try {
                const storedCity = parseStoredCity(localStorage.getItem(GEO_CITY_STORAGE_KEY));

                if (storedCity && hasCityCoordinates(storedCity)) {
                    this.persistCity(storedCity);
                    return;
                }

                const data = await $api.geo.getCityByIP();
                this.persistCity(data);
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

        setCity(city: CityResponse | string) {
            if (typeof city === 'string') {
                this.persistCity({ address: city, city });
                return;
            }
            this.persistCity(city);
        },

        openModal() {
            this.isModalOpen = true;
        },

        closeModal() {
            this.isModalOpen = false;
        }
    },
});
