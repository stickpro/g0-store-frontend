import HttpFactory from "../factory";
import type {
    GithubComStickproGoStoreInternalDtoCategoryTreeDTO,
} from "~/repository/types/api/generatedApiGo";

interface JSONResponseCategoryTree {
    code?: number;
    data?: GithubComStickproGoStoreInternalDtoCategoryTreeDTO[];
    message?: string;
}

class CategoryModule extends HttpFactory {
    private RESOURCE = '/category'

    /**
     * Get category tree
     * @returns Array of categories with children
     */
    async getTree(): Promise<GithubComStickproGoStoreInternalDtoCategoryTreeDTO[]> {
        const response = await this.get<JSONResponseCategoryTree>(`${this.RESOURCE}/tree`);
        return response.data || [];
    }
}

export default CategoryModule;
