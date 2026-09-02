import HttpFactory from "../factory";
import type {
    CategoryResponse,
    CategoryTreeDTO,
    BreadcrumbDTO,
    GithubComStickproGoStoreInternalDtoCategoryFiltersDTO,
    GithubComStickproGoStoreInternalDtoCategoryProductsResultDTO,
    JSONResponseCategoryResponse,
    JSONResponseArrayBreadcrumbDTO,
    JSONResponseGithubComStickproGoStoreInternalDtoCategoryFiltersDTO,
    JSONResponseGithubComStickproGoStoreInternalDtoCategoryProductsResultDTO,
} from "~/repository/types/api/generatedApiGo";

export type CategoryProductsParams = {
    page?: number;
    page_size?: number;
    facets?: boolean;
    manufacturer_id?: string;
    price_min?: string | number;
    price_max?: string | number;
    sort?: string;
    stock_status?: string;
    [key: string]: string | number | boolean | undefined;
};

interface JSONResponseCategoryTree {
    code?: number;
    data?: CategoryTreeDTO[];
    message?: string;
}

class CategoryModule extends HttpFactory {
    private RESOURCE = '/category'

    /**
     * Get category tree
     * @returns Array of categories with children
     */
    async getTree(): Promise<CategoryTreeDTO[]> {
        const response = await this.get<JSONResponseCategoryTree>(`${this.RESOURCE}/tree`);
        return response.data || [];
    }

    async getBySlug(slug: string): Promise<CategoryResponse> {
        const response = await this.get<JSONResponseCategoryResponse>(`${this.RESOURCE}/${slug}/`);
        return response.data || {} as CategoryResponse;
    }

    async getBreadcrumbs(slug: string): Promise<BreadcrumbDTO[]> {
        const response = await this.get<JSONResponseArrayBreadcrumbDTO>(
            `${this.RESOURCE}/${slug}/breadcrumbs`,
        );
        return response.data || [];
    }

    async getFilters(slug: string): Promise<GithubComStickproGoStoreInternalDtoCategoryFiltersDTO> {
        const response = await this.get<JSONResponseGithubComStickproGoStoreInternalDtoCategoryFiltersDTO>(
            `${this.RESOURCE}/${slug}/filters`,
        );
        return response.data || {};
    }

    async getProducts(
        slug: string,
        params?: CategoryProductsParams,
    ): Promise<GithubComStickproGoStoreInternalDtoCategoryProductsResultDTO> {
        const query = Object.fromEntries(
            Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== ''),
        );

        const response = await this.get<JSONResponseGithubComStickproGoStoreInternalDtoCategoryProductsResultDTO>(
            `${this.RESOURCE}/${slug}/products`,
            query,
        );

        return {
            items: response.data?.items || [],
            pagination: response.data?.pagination,
            facets: response.data?.facets,
            facet_stats: response.data?.facet_stats,
        };
    }
}

export default CategoryModule;
