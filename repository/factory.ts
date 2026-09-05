import {$fetch, type $Fetch, type FetchOptions} from "ofetch";

class HttpFactory {
    private readonly defaultOptions: FetchOptions<'json'>;
    private readonly $fetch: $Fetch;

    constructor(defaultOptions: FetchOptions<'json'> = {}) {
        this.defaultOptions = defaultOptions;
        this.$fetch = $fetch;
    }

    private request<T>(url: string, options: FetchOptions<'json'> = {}) {
        return this.$fetch<T>(url, {
            ...this.defaultOptions,
            ...options,
            onRequest: this.defaultOptions.onRequest,
        });
    }

    async get<T>(url: string, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        return await this.request<T>(url, {
            method: 'GET',
            query,
            ...options,
        });
    }

    async post<T>(url: string, data?: object, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        return await this.request<T>(url, {
            method: 'POST',
            body: data,
            query,
            ...options,
        });
    }

    async put<T>(url: string, data?: object, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        return await this.request<T>(url, {
            method: 'PUT',
            body: data,
            query,
            ...options,
        });
    }

    async patch<T>(url: string, data?: object, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        return await this.request<T>(url, {
            method: 'PATCH',
            body: data,
            query,
            ...options,
        });
    }

    async delete<T>(url: string, query?: object, options?: FetchOptions<'json'>): Promise<T> {
        return await this.request<T>(url, {
            method: 'DELETE',
            query,
            ...options,
        });
    }
}

export default HttpFactory;
