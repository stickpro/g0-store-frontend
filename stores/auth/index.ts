import { defineStore } from 'pinia';
import type { UserInfoResponse } from '~/repository/types/api/generatedApiGo';
import { USER } from '~/utils/constants/user';
import { translateAuthError } from '~/utils/authErrors';

export type AuthStep = 'email' | 'code';
export type AuthTab = 'login' | 'register';

function useAuthTokenCookie() {
    return useCookie<string | null>(USER.TOKEN_KEY_LS, {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
        path: '/',
    });
}

type State = {
    user: UserInfoResponse | null;
    isModalOpen: boolean;
    step: AuthStep;
    tab: AuthTab;
    email: string;
    loading: boolean;
    error: string;
}

export const useAuthStore = defineStore('Auth', {
    state: (): State => ({
        user: null,
        isModalOpen: false,
        step: 'email',
        tab: 'login',
        email: '',
        loading: false,
        error: '',
    }),

    getters: {
        isAuthenticated: (state) => Boolean(state.user?.email),
    },

    actions: {
        openModal(tab: AuthTab = 'login') {
            this.tab = tab;
            this.error = '';
            if (!this.isAuthenticated) {
                this.step = 'email';
                this.email = '';
            }
            this.isModalOpen = true;
        },

        closeModal() {
            this.isModalOpen = false;
            this.error = '';
            this.loading = false;
            if (!this.isAuthenticated) {
                this.step = 'email';
            }
        },

        setTab(tab: AuthTab) {
            this.tab = tab;
            this.error = '';
        },

        backToEmail() {
            this.step = 'email';
            this.error = '';
        },

        setToken(token: string | null) {
            useAuthTokenCookie().value = token;
        },

        async fetchUser() {
            const token = useAuthTokenCookie().value;
            if (!token) {
                this.user = null;
                return null;
            }

            const { $api } = useNuxtApp();

            try {
                this.user = await $api.auth.getInfo();
                return this.user;
            } catch (error) {
                const status = (error as { status?: number; statusCode?: number }).status
                    || (error as { statusCode?: number }).statusCode;
                if (status === 401) {
                    this.setToken(null);
                }
                this.user = null;
                return null;
            }
        },

        async requestCode(email: string) {
            const { $api } = useNuxtApp();
            this.loading = true;
            this.error = '';

            try {
                await $api.auth.sendCode({ email });
                this.email = email;
                this.step = 'code';
            } catch (error) {
                this.error = translateAuthError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async verifyCode(code: string) {
            const { $api } = useNuxtApp();
            this.loading = true;
            this.error = '';

            try {
                const response = await $api.auth.verify({
                    email: this.email,
                    code,
                });
                if (!response.token) {
                    throw new Error('Токен не получен');
                }
                this.setToken(response.token);
                await this.fetchUser();
                this.step = 'email';
                this.closeModal();
            } catch (error) {
                this.error = translateAuthError(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        logout() {
            this.setToken(null);
            this.user = null;
            this.email = '';
            this.step = 'email';
            this.closeModal();
        },
    },
});
