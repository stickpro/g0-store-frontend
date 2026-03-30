import HttpFactory from "../factory";
import type {
    AddCartItemRequest,
    CartResponse,
    JSONResponseCartResponse,
    UpdateCartItemRequest,
} from "~/repository/types/api/generatedApiGo";

class CartModule extends HttpFactory {
    private RESOURCE = '/cart'

    async getCart(): Promise<CartResponse> {
        const response = await this.get<JSONResponseCartResponse>(this.RESOURCE);
        return response.data || {};
    }

    async addItem(body: AddCartItemRequest): Promise<CartResponse> {
        const response = await this.post<JSONResponseCartResponse>(`${this.RESOURCE}/items`, body);
        return response.data || {};
    }

    async updateItem(variantId: string, body: UpdateCartItemRequest): Promise<CartResponse> {
        const response = await this.put<JSONResponseCartResponse>(`${this.RESOURCE}/items/${variantId}`, body);
        return response.data || {};
    }

    async removeItem(variantId: string): Promise<CartResponse> {
        const response = await this.delete<JSONResponseCartResponse>(`${this.RESOURCE}/items/${variantId}`);
        return response.data || {};
    }

    async clearCart(): Promise<void> {
        await this.delete<void>(this.RESOURCE);
    }
}

export default CartModule;
