import HttpFactory from "../factory";
import type {
    BreadcrumbDTO,
    JSONResponseArrayBreadcrumbDTO,
    JSONResponseArrayShortProduct,
    JSONResponseProductWithMediumResponse,
    ProductWithMediumResponse,
    ShortProduct,
} from "~/repository/types/api/generatedApiGo";


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

}

export default ProductModule;
