import HttpFactory from "../factory";
import type {
    CDEKDeliveryPointResponse,
    JSONResponseArrayCDEKDeliveryPointResponse,
} from "~/repository/types/api/generatedApiGo";

export type CdekDeliveryPointsQuery = {
    city_code?: number;
    postal_code?: string;
    type?: 'PVZ' | 'POSTAMAT';
    min_lat?: number;
    max_lat?: number;
    min_lon?: number;
    max_lon?: number;
};

class CdekModule extends HttpFactory {
    private RESOURCE = '/cdek/delivery-points'

    async getDeliveryPoints(query: CdekDeliveryPointsQuery = {}): Promise<CDEKDeliveryPointResponse[]> {
        const response = await this.get<JSONResponseArrayCDEKDeliveryPointResponse>(this.RESOURCE, query);
        return response.data || [];
    }
}

export default CdekModule;
