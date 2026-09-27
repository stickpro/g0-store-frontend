import HttpFactory from "../factory";
import type {
    CategoryResponse,
    JSONResponseResolveResponse,
    ProductWithMediumResponse,
} from "~/repository/types/api/generatedApiGo";

export type ResolvedCategory = {
    type: 'category';
    data: CategoryResponse;
};

export type ResolvedProduct = {
    type: 'product';
    data: ProductWithMediumResponse;
};

export type ResolvedSlug = ResolvedCategory | ResolvedProduct;

class ResolveModule extends HttpFactory {
    private RESOURCE = '/resolve';

    async bySlug(slug: string): Promise<ResolvedSlug> {
        const response = await this.get<JSONResponseResolveResponse>(`${this.RESOURCE}/${slug}`);
        const payload = response.data;

        if (payload?.type === 'category' && payload.data) {
            return {
                type: 'category',
                data: payload.data as CategoryResponse,
            };
        }

        if (payload?.type === 'product' && payload.data) {
            return {
                type: 'product',
                data: payload.data as ProductWithMediumResponse,
            };
        }

        throw new Error('slug not found');
    }
}

export default ResolveModule;
