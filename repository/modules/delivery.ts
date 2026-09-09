import HttpFactory from "../factory";
import type {
    DeliveryPointResponse,
    DeliveryProviderResponse,
    JSONResponseArrayDeliveryPointResponse,
    JSONResponseArrayDeliveryProviderResponse,
} from "~/repository/types/api/generatedApiGo";

export type DeliveryProviderCode = 'cdek' | 'yandex_delivery' | 'pochta';

export type DeliveryPointsQuery = {
    index?: string;
    latitude?: number;
    locality?: string;
    longitude?: number;
    max_lat?: number;
    max_lon?: number;
    min_lat?: number;
    min_lon?: number;
    radius_km?: number;
    region?: string;
    type?: string;
};

class DeliveryModule extends HttpFactory {
    private PROVIDERS = '/delivery/providers';

    async getProviders(): Promise<DeliveryProviderResponse[]> {
        const response = await this.get<JSONResponseArrayDeliveryProviderResponse>(this.PROVIDERS);
        return response.data || [];
    }

    async getDeliveryPoints(
        provider: DeliveryProviderCode,
        query: DeliveryPointsQuery = {},
    ): Promise<DeliveryPointResponse[]> {
        const response = await this.get<JSONResponseArrayDeliveryPointResponse>(
            `/delivery/${provider}/points`,
            query,
        );
        return response.data || [];
    }
}

export default DeliveryModule;
