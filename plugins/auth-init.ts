import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin({
    name: 'auth-init',
    dependsOn: ['api'],
    async setup() {
        const authStore = useAuthStore();
        await authStore.fetchUser();
    },
});
