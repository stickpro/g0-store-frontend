import HttpFactory from "../factory";
import type {
    AuthResponse,
    JSONResponseAuthResponse,
    JSONResponseSendCodeResponse,
    JSONResponseUserInfoResponse,
    SendCodeRequest,
    SendCodeResponse,
    UserInfoResponse,
    VerifyCodeRequest,
} from "~/repository/types/api/generatedApiGo";

class AuthModule extends HttpFactory {
    async sendCode(payload: SendCodeRequest): Promise<SendCodeResponse> {
        const response = await this.post<JSONResponseSendCodeResponse>('/auth/code', payload);
        return response.data || { sent: true };
    }

    async verify(payload: VerifyCodeRequest): Promise<AuthResponse> {
        const response = await this.post<JSONResponseAuthResponse>('/auth/verify', payload);
        return response.data || {};
    }

    async getInfo(token?: string): Promise<UserInfoResponse | null> {
        const response = await this.get<JSONResponseUserInfoResponse>(
            '/user/info',
            undefined,
            token ? { headers: { Authorization: `Bearer ${token}` } } : undefined,
        );
        return response.data || null;
    }
}

export default AuthModule;
