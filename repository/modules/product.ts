import HttpFactory from "../factory";
import type {
    ProductResponse,
    JSONResponseProductResponse,
    BreadcrumbDTO,
    JSONResponseArrayBreadcrumbDTO,
} from "~/repository/types/api/generatedApiGo";


class ProductModule extends HttpFactory {
    private RESOURCE = '/product'

    /**
     * Получить информацию о товаре по slug
     * @param slug - уникальный идентификатор товара в URL
     * @returns ProductResponse - полная информация о товаре
     */
    async getBySlug(slug: string): Promise<ProductResponse> {
        const response = await this.get<JSONResponseProductResponse>(`${this.RESOURCE}/${slug}`);
        return response.data || {} as ProductResponse;
    }

    /**
     * Получить хлебные крошки для товара по slug
     * @param slug - уникальный идентификатор товара в URL
     * @returns BreadcrumbDTO[] - массив хлебных крошек
     */
    async getBreadcrumbsBySlug(slug: string): Promise<BreadcrumbDTO[]> {
        const response = await this.get<JSONResponseArrayBreadcrumbDTO>(
            `${this.RESOURCE}/${slug}/breadcrumbs`
        );
        return response.data || [];
    }
}

export default ProductModule;
