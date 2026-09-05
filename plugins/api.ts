import { defineNuxtPlugin } from "#app";
import GeoModule from "~/repository/modules/geo";
import CollectionModule from "~/repository/modules/collection";
import ProductModule from "~/repository/modules/product";
import CategoryModule from "~/repository/modules/category";
import CartModule from "~/repository/modules/cart";
import SearchModule from "~/repository/modules/search";
import AuthModule from "~/repository/modules/auth";
import OrderModule from "~/repository/modules/order";
import CdekModule from "~/repository/modules/cdek";
import ViewedModule from "~/repository/modules/viewed";
import type { FetchOptions, FetchContext } from "ofetch";

interface IApiInstance {
    geo: GeoModule;
    collection: CollectionModule;
    product: ProductModule;
    category: CategoryModule;
    cart: CartModule;
    search: SearchModule;
    auth: AuthModule;
    order: OrderModule;
    cdek: CdekModule;
    viewed: ViewedModule;
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

    const { token, cookie } = useAuthToken();

    const fetchOptions: FetchOptions<'json'> = {
        baseURL: config.public.apiUrl,
        onRequest({ options }: FetchContext) {
            const headers = new Headers(options.headers);
            if (sessionId.value) {
                headers.set('X-Session-ID', sessionId.value);
            }
            const bearer = token.value || cookie.value;
            if (bearer) {
                headers.set('Authorization', `Bearer ${bearer}`);
            }
            const plain: Record<string, string> = {};
            headers.forEach((value, key) => {
                plain[key] = value;
            });
            options.headers = plain;
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
        order: new OrderModule(fetchOptions),
        cdek: new CdekModule(fetchOptions),
        viewed: new ViewedModule(fetchOptions),
    };

    return {
        provide: {
            api: modules,
        },
    };
    },
});
