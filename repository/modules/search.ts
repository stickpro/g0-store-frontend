import HttpFactory from '../factory';
import type {
    JSONResponseVariantListResponse,
    VariantListResponse,
} from '~/repository/types/api/generatedApiGo';
import type { CategoryProductsParams } from '~/repository/modules/category';

export type SearchParams = CategoryProductsParams & {
    q?: string;
    category?: string;
};

class SearchModule extends HttpFactory {
    private RESOURCE = '/search';

    async search(params?: SearchParams): Promise<VariantListResponse> {
        const query = Object.fromEntries(
            Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== ''),
        );

        const response = await this.get<JSONResponseVariantListResponse>(
            this.RESOURCE,
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

export default SearchModule;
