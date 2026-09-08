import HttpFactory from "../factory";
import type {
    JSONResponseArrayYandexDeliveryPointResponse,
    YandexDeliveryPointResponse,
} from "~/repository/types/api/generatedApiGo";

export type YandexDeliveryPointsQuery = {
    geo_id?: number;
    locality?: string;
    type?: string;
    min_lat?: number;
    max_lat?: number;
    min_lon?: number;
    max_lon?: number;
};

class YandexDeliveryModule extends HttpFactory {
    private RESOURCE = '/yandex-delivery/delivery-points'

    async getDeliveryPoints(query: YandexDeliveryPointsQuery = {}): Promise<YandexDeliveryPointResponse[]> {
        const response = await this.get<JSONResponseArrayYandexDeliveryPointResponse>(this.RESOURCE, query);
        return response.data || [];
    }
}

export default YandexDeliveryModule;
