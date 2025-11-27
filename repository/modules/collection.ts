import HttpFactory from "../factory";
import type {
    Collection,
    CollectionResponse,
    CollectionWithProductResponse,
    JSONResponseCollectionResponse,
    JSONResponseCollectionWithProductResponse,
    JSONResponseResponseWithFullPaginationCollection
} from "~/repository/types/api/generatedApiGo";


class CollectionModule extends HttpFactory {
    private RESOURCE = '/collection'

    async getAll(params?: {
        page?: number;
        page_size?: number;
        search?: string;
    }): Promise<{ items: Collection[]; pagination?: any }> {
        const response = await this.get<JSONResponseResponseWithFullPaginationCollection>(
            this.RESOURCE,
            params
        );
        return {
            items: response.data?.items || [],
            pagination: response.data?.pagination
        };
    }

    async getById(id: string): Promise<CollectionResponse> {
        const response = await this.get<JSONResponseCollectionResponse>(`${this.RESOURCE}/${id}`);
        return response.data || {} as CollectionResponse;
    }

    async getBySlug(slug: string): Promise<CollectionResponse> {
        const response = await this.get<JSONResponseCollectionResponse>(`${this.RESOURCE}/slug/${slug}`);
        return response.data || {} as CollectionResponse;
    }

    async getPopular(): Promise<CollectionWithProductResponse> {
        const response = await this.get<JSONResponseCollectionWithProductResponse>(
            `${this.RESOURCE}/popular`
        );
        return response.data || {} as CollectionWithProductResponse;
    }
}

export default CollectionModule;