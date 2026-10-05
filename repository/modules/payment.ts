import HttpFactory from "../factory";
import type {
    InitPaymentRequest,
    JSONResponseArrayPaymentMethodResponse,
    JSONResponsePaymentResponse,
    PaymentMethodResponse,
    PaymentResponse,
} from "~/repository/types/api/generatedApiGo";

class PaymentModule extends HttpFactory {
    private METHODS = '/payments/methods';

    async getMethods(): Promise<PaymentMethodResponse[]> {
        const response = await this.get<JSONResponseArrayPaymentMethodResponse>(this.METHODS);
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
