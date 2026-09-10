import HttpFactory from "../factory";
import type {
    DeliveryMethodResponse,
    DeliveryPointResponse,
    DeliveryProviderResponse,
    JSONResponseArrayDeliveryMethodResponse,
    JSONResponseArrayDeliveryPointResponse,
    JSONResponseArrayDeliveryProviderResponse,
} from "~/repository/types/api/generatedApiGo";

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
    private METHODS = '/delivery/methods';
    private PROVIDERS = '/delivery/providers';

    async getMethods(): Promise<DeliveryMethodResponse[]> {
        const response = await this.get<JSONResponseArrayDeliveryMethodResponse>(this.METHODS);
        return response.data || [];
    }

    async getProviders(): Promise<DeliveryProviderResponse[]> {
        const response = await this.get<JSONResponseArrayDeliveryProviderResponse>(this.PROVIDERS);
        return response.data || [];
    }

    async getDeliveryPoints(
        provider: string,
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
