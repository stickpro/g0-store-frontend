import HttpFactory from "../factory";
import type {
    City,
    GeoResponse,
    JSONResponseGeoResponse,
    JSONResponseArrayCity
} from "~/repository/types/api/generatedApiGo";


class GeoModule extends HttpFactory {
    private RESOURCE = '/geo'

    async getCityByIP(): Promise<GeoResponse> {
        const response = await this.get<JSONResponseGeoResponse>(`${this.RESOURCE}/city`);
        return response.data || { city: '' };
    }

    async getPopularCity(): Promise<City[]> {
        const response = await this.get<JSONResponseArrayCity>(`${this.RESOURCE}/city/popular`);
        return response.data || [];
    }

    async findCity(cityName: string): Promise<City[]> {
        const response = await this.get<JSONResponseArrayCity>(`${this.RESOURCE}/city/find`, { city: cityName });
        return response.data || [];
    }
}

export default GeoModule;
