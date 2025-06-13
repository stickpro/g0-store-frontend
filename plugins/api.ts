import { defineNuxtPlugin } from "#app";
import GeoModule from "~/repository/modules/geo";
import type { FetchOptions } from "#app";

interface IApiInstance {
    geo: GeoModule;
}

declare module "#app" {
    interface NuxtApp {
        $api: IApiInstance;
    }
}

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const fetchOptions: FetchOptions<'json'> = {
        baseURL: config.public.apiUrl,
        headers: {
            Authorization: `Bearer ${useState('authToken').value || ''}`,
        },
    };

    const modules: IApiInstance = {
        geo: new GeoModule(fetchOptions),
    };

    return {
        provide: {
            api: modules,
        },
    };
});
