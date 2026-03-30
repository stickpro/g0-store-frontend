import { defineNuxtPlugin } from "#app";
import GeoModule from "~/repository/modules/geo";
import CollectionModule from "~/repository/modules/collection";
import ProductModule from "~/repository/modules/product";
import CategoryModule from "~/repository/modules/category";
import CartModule from "~/repository/modules/cart";
import type { FetchOptions, FetchContext } from "ofetch";

interface IApiInstance {
    geo: GeoModule;
    collection: CollectionModule;
    product: ProductModule;
    category: CategoryModule;
    cart: CartModule;
}

declare module "#app" {
    interface NuxtApp {
        $api: IApiInstance;
    }
}

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    const sessionId = useCookie('session_id', {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
    });

    if (!sessionId.value) {
        sessionId.value = crypto.randomUUID();
    }

    const fetchOptions: FetchOptions<'json'> = {
        baseURL: config.public.apiUrl,
        onRequest({ options }: FetchContext) {
            options.headers = new Headers(options.headers);
            options.headers.set('X-Session-ID', sessionId.value!);
            const token = useState('authToken').value;
            if (token) {
                options.headers.set('Authorization', `Bearer ${token}`);
            }
        },
    };

    const modules: IApiInstance = {
        geo: new GeoModule(fetchOptions),
        collection: new CollectionModule(fetchOptions),
        product: new ProductModule(fetchOptions),
        category: new CategoryModule(fetchOptions),
        cart: new CartModule(fetchOptions),
    };

    return {
        provide: {
            api: modules,
        },
    };
});
