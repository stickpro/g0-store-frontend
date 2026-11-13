import {$fetch, type $Fetch, type FetchOptions} from "ofetch";

export type BlobDownloadResult = {
    ok: boolean;
    status: number;
    blob: Blob;
    headers: Headers;
};

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

    /** Authenticated binary GET — keeps the same onRequest headers as JSON calls. */
    async getBlob(url: string, query?: object): Promise<BlobDownloadResult> {
        // ofetch's default $Fetch typing is JSON-centric; bypass for binary downloads.
        const response = await $fetch.raw(url, {
            baseURL: this.defaultOptions.baseURL,
            method: 'GET',
            query,
            responseType: 'blob',
            ignoreResponseError: true,
            onRequest: this.defaultOptions.onRequest,
        } as never);
        return {
            ok: response.ok,
            status: response.status,
            blob: response._data as Blob,
            headers: response.headers,
        };
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
