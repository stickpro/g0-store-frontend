import { defineNuxtPlugin } from "#app";
import GeoModule from "~/repository/modules/geo";
import CollectionModule from "~/repository/modules/collection";
import ProductModule from "~/repository/modules/product";
import type { FetchOptions, FetchContext } from "ofetch";

interface IApiInstance {
    geo: GeoModule;
    collection: CollectionModule;
    product: ProductModule;
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
        onRequest({ options }: FetchContext) {
            const token = useState('authToken').value;
            if (token) {
                options.headers = new Headers(options.headers);
                options.headers.set('Authorization', `Bearer ${token}`);
            }
        },
    };

    const modules: IApiInstance = {
        geo: new GeoModule(fetchOptions),
        collection: new CollectionModule(fetchOptions),
        product: new ProductModule(fetchOptions),
    };

    return {
        provide: {
            api: modules,
        },
    };
});
