import HttpFactory from "../factory";
import type {
    CityResponse,
    JSONResponseCityResponse,
    JSONResponseArrayCityResponse,
} from "~/repository/types/api/generatedApiGo";


class GeoModule extends HttpFactory {
    private RESOURCE = '/geo'

    async getCityByIP(): Promise<CityResponse> {
        const response = await this.get<JSONResponseCityResponse>(`${this.RESOURCE}/city`);
        return response.data || {};
    }

    async getPopularCity(): Promise<CityResponse[]> {
        const response = await this.get<JSONResponseArrayCityResponse>(`${this.RESOURCE}/city/popular`);
        return response.data || [];
    }

    async findCity(cityName: string): Promise<CityResponse[]> {
        const response = await this.get<JSONResponseArrayCityResponse>(`${this.RESOURCE}/city/find`, { city: cityName });
        return response.data || [];
    }
}

export default GeoModule;
