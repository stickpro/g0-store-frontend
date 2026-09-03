import { defineNuxtPlugin } from "#app";
import GeoModule from "~/repository/modules/geo";
import CollectionModule from "~/repository/modules/collection";
import ProductModule from "~/repository/modules/product";
import CategoryModule from "~/repository/modules/category";
import CartModule from "~/repository/modules/cart";
import SearchModule from "~/repository/modules/search";
import AuthModule from "~/repository/modules/auth";
import type { FetchOptions, FetchContext } from "ofetch";
import { USER } from "~/utils/constants/user";

interface IApiInstance {
    geo: GeoModule;
    collection: CollectionModule;
    product: ProductModule;
    category: CategoryModule;
    cart: CartModule;
    search: SearchModule;
    auth: AuthModule;
}

declare module "#app" {
    interface NuxtApp {
        $api: IApiInstance;
    }
}

export default defineNuxtPlugin({
    name: 'api',
    setup() {
    const config = useRuntimeConfig()

    const sessionId = useCookie('session_id', {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
    });

    if (!sessionId.value) {
        sessionId.value = crypto.randomUUID();
    }

    const authToken = useCookie<string | null>(USER.TOKEN_KEY_LS, {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        path: '/',
    });

    const fetchOptions: FetchOptions<'json'> = {
        baseURL: config.public.apiUrl,
        onRequest({ options }: FetchContext) {
            options.headers = new Headers(options.headers);
            options.headers.set('X-Session-ID', sessionId.value!);
            if (authToken.value) {
                options.headers.set('Authorization', `Bearer ${authToken.value}`);
            }
        },
    };

    const modules: IApiInstance = {
        geo: new GeoModule(fetchOptions),
        collection: new CollectionModule(fetchOptions),
        product: new ProductModule(fetchOptions),
        category: new CategoryModule(fetchOptions),
        cart: new CartModule(fetchOptions),
        search: new SearchModule(fetchOptions),
        auth: new AuthModule(fetchOptions),
    };

    return {
        provide: {
            api: modules,
        },
    };
    },
});
