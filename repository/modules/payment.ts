import HttpFactory from "../factory";
import type {
    InitPaymentRequest,
    JSONResponseArrayPaymentMethodResponse,
    JSONResponsePaymentResponse,
    PaymentMethodResponse,
    PaymentResponse,
} from "~/repository/types/api/generatedApiGo";

export type PaymentMethodsQuery = {
    customer_type?: 'individual' | 'legal';
    delivery_method_code?: string;
};

class PaymentModule extends HttpFactory {
    private METHODS = '/payments/methods';

    async getMethods(query?: PaymentMethodsQuery): Promise<PaymentMethodResponse[]> {
        const response = await this.get<JSONResponseArrayPaymentMethodResponse>(this.METHODS, query);
        return response.data || [];
    }

    async getByOrderId(orderId: string): Promise<PaymentResponse> {
        const response = await this.get<JSONResponsePaymentResponse>(`/orders/${orderId}/payment`);
        return response.data || {};
    }

    async init(orderId: string, body: InitPaymentRequest): Promise<PaymentResponse> {
        const response = await this.post<JSONResponsePaymentResponse>(
            `/orders/${orderId}/payment`,
            body,
        );
        return response.data || {};
    }
}

export default PaymentModule;
