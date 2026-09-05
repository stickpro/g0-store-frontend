import { defineStore } from 'pinia';
import type { UserInfoResponse } from '~/repository/types/api/generatedApiGo';
import { translateAuthError } from '~/utils/authErrors';

export type AuthStep = 'email' | 'code';
export type AuthTab = 'login' | 'register';

type State = {
    user: UserInfoResponse | null;
    token: string | null;
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
        token: null,
        isModalOpen: false,
        step: 'email',
        tab: 'login',
        email: '',
        loading: false,
        error: '',
    }),

    getters: {
        isAuthenticated: (state) => Boolean(state.user?.email || state.token),
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
            useAuthToken().setToken(token);
            this.token = token;
        },

        async fetchUser() {
            const { token } = useAuthToken();
            this.token = token.value;
            if (!token.value) {
                this.user = null;
                return null;
            }

            const { $api } = useNuxtApp();

            try {
                const user = await $api.auth.getInfo(token.value);
                if (!user?.email) {
                    return this.user;
                }
                this.user = user;
                return this.user;
            } catch (error) {
                const status = (error as { status?: number; statusCode?: number }).status
                    || (error as { statusCode?: number }).statusCode;
                if (status === 401) {
                    this.setToken(null);
                    this.user = null;
                }
                return this.user;
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
                this.user = {
                    email: this.email,
                    location: '',
                };
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
