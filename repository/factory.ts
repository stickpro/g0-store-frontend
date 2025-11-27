import {$fetch, type $Fetch, type FetchOptions} from "ofetch";

class HttpFactory {
    private readonly defaultOptions: FetchOptions<'json'>;
    private readonly $fetch: $Fetch;

    constructor(defaultOptions: FetchOptions<'json'> = {}) {
        this.defaultOptions = defaultOptions;
        this.$fetch = $fetch;
    }

    async get<T>(url: string, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        return await this.$fetch<T>(url, {
            method: 'GET',
            query,
            ...this.defaultOptions,
            ...options,
        });
    }

    async post<T>(url: string, data?: object, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        return await this.$fetch<T>(url, {
            method: 'POST',
            body: data,
            query,
            ...this.defaultOptions,
            ...options,
        });
    }

    async put<T>(url: string, data?: object, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        return await this.$fetch<T>(url, {
            method: 'PUT',
            body: data,
            query,
            ...this.defaultOptions,
            ...options,
        });
    }

    async patch<T>(url: string, data?: object, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        return await this.$fetch<T>(url, {
            method: 'PATCH',
            body: data,
            query,
            ...this.defaultOptions,
            ...options,
        });
    }

    async delete<T>(url: string, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        return await this.$fetch<T>(url, {
            method: 'DELETE',
            query,
            ...this.defaultOptions,
            ...options,
        });
    }
}

export default HttpFactory;
