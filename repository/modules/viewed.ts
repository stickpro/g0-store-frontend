import HttpFactory from "../factory";
import type {
    JSONResponseViewedResponse,
    TrackViewedRequest,
    VariantCardResponse,
    ViewedItemResponse,
    ViewedResponse,
} from "~/repository/types/api/generatedApiGo";

function toVariantCard(item: ViewedItemResponse): VariantCardResponse {
    return {
        id: item.variant_id,
        product_id: item.product_id,
        name: item.name,
        slug: item.slug,
        image: item.image,
        price_retail: item.price,
    };
}

class ViewedModule extends HttpFactory {
    private RESOURCE = '/viewed-products'

    async list(): Promise<VariantCardResponse[]> {
        const response = await this.get<JSONResponseViewedResponse>(this.RESOURCE);
        return (response.data?.items || [])
            .filter((item) => item.variant_id && item.slug)
            .map(toVariantCard);
    }

    async track(variantId: string): Promise<ViewedResponse> {
        const body: TrackViewedRequest = { variant_id: variantId };
        const response = await this.post<JSONResponseViewedResponse>(this.RESOURCE, body);
        return response.data || {};
    }
}

export default ViewedModule;
