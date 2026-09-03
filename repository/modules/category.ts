import HttpFactory from "../factory";
import type {
    CategoryResponse,
    CategoryTreeResponse,
    BreadcrumbResponse,
    CategoryFiltersResponse,
    VariantListResponse,
    JSONResponseCategoryResponse,
    JSONResponseArrayBreadcrumbResponse,
    JSONResponseArrayCategoryTreeResponse,
    JSONResponseCategoryFiltersResponse,
    JSONResponseVariantListResponse,
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

class CategoryModule extends HttpFactory {
    private RESOURCE = '/category'

    /**
     * Get category tree
     * @returns Array of categories with children
     */
    async getTree(): Promise<CategoryTreeResponse[]> {
        const response = await this.get<JSONResponseArrayCategoryTreeResponse>(`${this.RESOURCE}/tree`);
        return response.data || [];
    }

    async getBySlug(slug: string): Promise<CategoryResponse> {
        const response = await this.get<JSONResponseCategoryResponse>(`${this.RESOURCE}/${slug}/`);
        return response.data || {} as CategoryResponse;
    }

    async getBreadcrumbs(slug: string): Promise<BreadcrumbResponse[]> {
        const response = await this.get<JSONResponseArrayBreadcrumbResponse>(
            `${this.RESOURCE}/${slug}/breadcrumbs`,
        );
        return response.data || [];
    }

    async getFilters(slug: string): Promise<CategoryFiltersResponse> {
        const response = await this.get<JSONResponseCategoryFiltersResponse>(
            `${this.RESOURCE}/${slug}/filters`,
        );
        return response.data || {};
    }

    async getProducts(
        slug: string,
        params?: CategoryProductsParams,
    ): Promise<VariantListResponse> {
        const query = Object.fromEntries(
            Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== ''),
        );

        const response = await this.get<JSONResponseVariantListResponse>(
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
