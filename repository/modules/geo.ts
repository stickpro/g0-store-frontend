import HttpFactory from "../factory";
import type {CityResponse, GeoResponse} from "~/repository/types/api/generatedApiGo";


class GeoModule extends HttpFactory<any> {
    private RESOURCE = '/geo'

    async getCityByIP(): Promise<GeoResponse> {
        try {
            return  await this.get(`${this.RESOURCE}/city`)
        } catch (error) {
            throw new Error("Failed to fetch geo ip");
        }
    }

    async getPopularCity(): Promise<CityResponse[]> {
        try {
            return await this.get(`${this.RESOURCE}/city/popular`)
        } catch (error) {
            throw new Error("Failed to fetch popular city");
        }
    }

    async findCity(cityName: string): Promise<any[]> {
        try {
            return await this.get(`${this.RESOURCE}/city/find`, { 'city': cityName });
        } catch (error) {
            throw new Error("Failed to fetch popular city");
        }
    }
}

export default GeoModule;
