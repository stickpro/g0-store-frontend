import {$fetch, type $Fetch, type FetchOptions} from "ofetch";

class HttpFactory {
    private readonly defaultOptions: FetchOptions<'json'>;
    private readonly $fetch: $Fetch;

    constructor(defaultOptions: FetchOptions<'json'> = {}) {
        this.defaultOptions = defaultOptions;
        this.$fetch = $fetch;
    }

    async get<T>(url: string, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        const { data, error } = await this.$fetch<T>(url, {
            method: 'GET',
            query,
            lazy: true,
            server: false,
            ...this.defaultOptions,
            ...options,
        });


        if (error) {
            throw new Error(useNuxtApp().$handleApiError(error));
        }
        return data as T;
    }

    async post<T>(url: string, data?: object, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        const { data: response, error } = await this.$fetch<T>(url, {
            method: 'POST',
            body: data,
            query,
            ...this.defaultOptions,
            ...options,
        });

        if (error) {
            throw new Error(useNuxtApp().$handleApiError(error));
        }

        return response as T;
    }

    async put<T>(url: string, data?: object, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        const { data: response, error } = await this.$fetch<T>(url, {
            method: 'PUT',
            body: data,
            query,
            ...this.defaultOptions,
            ...options,
        });

        if (error) {
            throw new Error(useNuxtApp().$handleApiError(error));
        }

        return response as T;
    }

    async patch<T>(url: string, data?: object, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        const { data: response, error } = await this.$fetch<T>(url, {
            method: 'PATCH',
            body: data,
            query,
            ...this.defaultOptions,
            ...options,
        });

        if (error) {
            throw new Error(useNuxtApp().$handleApiError(error));
        }

        return response as T;
    }

    async delete<T>(url: string, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        const { data: response, error } = await this.$fetch<T>(url, {
            method: 'DELETE',
            query,
            ...this.defaultOptions,
            ...options,
        });

        if (error) {
            throw new Error(useNuxtApp().$handleApiError(error));
        }

        return response as T;
    }
}

export default HttpFactory;
