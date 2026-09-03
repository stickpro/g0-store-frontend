import HttpFactory from "../factory";
import type {
    AttributeGroupResponse,
    BreadcrumbResponse,
    JSONResponseArrayBreadcrumbResponse,
    JSONResponseArrayVariantCardResponse,
    JSONResponseAttributeGroupsResponse,
    JSONResponseProductWithMediumResponse,
    JSONResponseResponseWithFullPaginationProductReviewResponse,
    ProductWithMediumResponse,
    ProductReviewResponse,
    VariantCardResponse,
} from "~/repository/types/api/generatedApiGo";

class ProductModule extends HttpFactory {
    private RESOURCE = '/product'

    async getBySlug(slug: string): Promise<ProductWithMediumResponse> {
        const response = await this.get<JSONResponseProductWithMediumResponse>(`${this.RESOURCE}/${slug}`);
        return response.data || {} as ProductWithMediumResponse;
    }

    async getBreadcrumbsBySlug(slug: string): Promise<BreadcrumbResponse[]> {
        const response = await this.get<JSONResponseArrayBreadcrumbResponse>(
            `${this.RESOURCE}/${slug}/breadcrumbs`
        );
        return response.data || [];
    }

    async getRelatedProductBySlug(slug: string): Promise<VariantCardResponse[]> {
        const response = await this.get<JSONResponseArrayVariantCardResponse>(
            `${this.RESOURCE}/${slug}/related-products`,
        )
        return response.data || [];
    }

    async getAttributesBySlug(slug: string): Promise<AttributeGroupResponse[]> {
        const response = await this.get<JSONResponseAttributeGroupsResponse>(
            `${this.RESOURCE}/${slug}/attributes`,
        )
        return response.data?.groups || [];
    }

    async getReviewsBySlug(slug: string): Promise<ProductReviewResponse[]> {
        const response = await this.get<JSONResponseResponseWithFullPaginationProductReviewResponse>(
            `${this.RESOURCE}/${slug}/reviews`,
        )
        return response.data?.items || [];
    }

}

export default ProductModule;
