import HttpFactory from "../factory";
import type {
    AttributeGroupWithValuesDTO,
    BreadcrumbDTO,
    JSONResponseArrayBreadcrumbDTO,
    JSONResponseArrayShortProduct,
    JSONResponseAttributeGroupsResponse,
    JSONResponseProductWithMediumResponse,
    ProductWithMediumResponse,
    ProductReviewResponse,
    ShortProduct,
    FullPagingData,
} from "~/repository/types/api/generatedApiGo";

interface ReviewsWithPaginationResponse {
    items?: ProductReviewResponse[];
    pagination?: FullPagingData;
}

interface JSONResponseReviewsWithPagination {
    code?: number;
    data?: ReviewsWithPaginationResponse;
    message?: string;
}


class ProductModule extends HttpFactory {
    private RESOURCE = '/product'

    async getBySlug(slug: string): Promise<ProductWithMediumResponse> {
        const response = await this.get<JSONResponseProductWithMediumResponse>(`${this.RESOURCE}/${slug}`);
        return response.data || {} as ProductWithMediumResponse;
    }

    async getBreadcrumbsBySlug(slug: string): Promise<BreadcrumbDTO[]> {
        const response = await this.get<JSONResponseArrayBreadcrumbDTO>(
            `${this.RESOURCE}/${slug}/breadcrumbs`
        );
        return response.data || [];
    }

    async getRelatedProductBySlug(slug: string): Promise<ShortProduct[]> {
        const response = await this.get<JSONResponseArrayShortProduct>(
            `${this.RESOURCE}/${slug}/related-products`,
        )
        return response.data || [];
    }

    async getAttributesBySlug(slug: string): Promise<AttributeGroupWithValuesDTO[]> {
        const response = await this.get<JSONResponseAttributeGroupsResponse>(
            `${this.RESOURCE}/${slug}/attributes`,
        )
        return response.data?.groups || [];
    }

    async getReviewsBySlug(slug: string): Promise<ProductReviewResponse[]> {
        const response = await this.get<JSONResponseReviewsWithPagination>(
            `${this.RESOURCE}/${slug}/reviews`,
        )
        return response.data?.items || [];
    }

}

export default ProductModule;