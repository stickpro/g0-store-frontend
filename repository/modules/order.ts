import HttpFactory from "../factory";
import type {
    CreateOrderRequest,
    FullPagingData,
    JSONResponseOrderResponse,
    JSONResponseResponseWithFullPaginationOrderResponse,
    OrderResponse,
} from "~/repository/types/api/generatedApiGo";

export type OrderListQuery = {
    page?: number;
    page_size?: number;
};

class OrderModule extends HttpFactory {
    private RESOURCE = '/orders'

    async list(params: OrderListQuery = {}): Promise<{ items: OrderResponse[]; pagination?: FullPagingData }> {
        const response = await this.get<JSONResponseResponseWithFullPaginationOrderResponse>(
            this.RESOURCE,
            params,
        );
        return {
            items: response.data?.items || [],
            pagination: response.data?.pagination,
        };
    }

    async getByNumber(number: string | number): Promise<OrderResponse> {
        const response = await this.get<JSONResponseOrderResponse>(`${this.RESOURCE}/${number}`);
        return response.data || {};
    }

    async create(body: CreateOrderRequest, idempotencyKey: string): Promise<OrderResponse> {
        const response = await this.post<JSONResponseOrderResponse>(
            this.RESOURCE,
            body,
            undefined,
            { headers: { 'Idempotency-Key': idempotencyKey } },
        );
        return response.data || {};
    }
}

export default OrderModule;
