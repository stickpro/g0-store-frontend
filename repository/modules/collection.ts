import HttpFactory from "../factory";
import type {
    CollectionResponse,
    CollectionWithProductResponse,
    FullPagingData,
    JSONResponseCollectionWithProductResponse,
    JSONResponseResponseWithFullPaginationGithubComStickproGoStoreInternalModelsCollection,
} from "~/repository/types/api/generatedApiGo";


class CollectionModule extends HttpFactory {
    private RESOURCE = '/collection'

    async getAll(params?: {
        page?: number;
        page_size?: number;
        search?: string;
    }): Promise<{ items: CollectionResponse[]; pagination?: FullPagingData }> {
        const response = await this.get<JSONResponseResponseWithFullPaginationGithubComStickproGoStoreInternalModelsCollection>(
            this.RESOURCE,
            params
        );
        return {
            items: (response.data?.items || []) as CollectionResponse[],
            pagination: response.data?.pagination
        };
    }

    async getById(id: string): Promise<CollectionWithProductResponse> {
        const response = await this.get<JSONResponseCollectionWithProductResponse>(`${this.RESOURCE}/${id}`);
        return response.data || {} as CollectionWithProductResponse;
    }

    async getBySlug(slug: string): Promise<CollectionWithProductResponse> {
        const response = await this.get<JSONResponseCollectionWithProductResponse>(`${this.RESOURCE}/${slug}`);
        return response.data || {} as CollectionWithProductResponse;
    }
}

export default CollectionModule;
