import { USER } from '~/utils/constants/user';

const COOKIE_OPTIONS = {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax' as const,
    path: '/',
};

export function useAuthToken() {
    const cookie = useCookie<string | null>(USER.TOKEN_KEY_LS, COOKIE_OPTIONS);
    const token = useState<string | null>('auth-token', () => cookie.value || null);

    function setToken(value: string | null) {
        cookie.value = value;
        token.value = value;
    }

    if (cookie.value && !token.value) {
        token.value = cookie.value;
    }

    return { token, cookie, setToken };
}
