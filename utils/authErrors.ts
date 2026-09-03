const AUTH_ERROR_MESSAGES: Record<string, string> = {
    'invalid credentials': 'Неверный логин или пароль',
    'account is banned': 'Аккаунт заблокирован',
    'admin accounts must log in with a password': 'Этот аккаунт входит по паролю, а не по коду',
    'invalid code': 'Неверный код',
    'code expired or not found': 'Код истёк или не найден. Запросите новый',
    'too many attempts, request a new code': 'Слишком много попыток. Запросите новый код',
    'a code was just sent, please wait before requesting another':
        'Код уже отправлен. Подождите немного и запросите снова',
    'too many code requests, try again later': 'Слишком много запросов кода. Попробуйте позже',
};

function collectMessages(error: unknown): string[] {
    const err = error as {
        data?: {
            message?: string;
            errors?: { message?: string }[];
            data?: {
                message?: string;
                errors?: { message?: string }[];
            };
        };
        message?: string;
        statusMessage?: string;
    };

    const payload = err.data;
    const messages = [
        payload?.message,
        payload?.data?.message,
        ...(payload?.errors || []).map((item) => item.message),
        ...(payload?.data?.errors || []).map((item) => item.message),
        err.message,
        err.statusMessage,
    ].filter((item): item is string => Boolean(item));

    return messages;
}

export function translateAuthError(error: unknown): string {
    const status = (error as { status?: number; statusCode?: number }).status
        || (error as { statusCode?: number }).statusCode;

    for (const message of collectMessages(error)) {
        const normalized = message.trim().toLowerCase();
        const translated = AUTH_ERROR_MESSAGES[normalized]
            || Object.entries(AUTH_ERROR_MESSAGES).find(([key]) => normalized.includes(key))?.[1];

        if (translated) return translated;
    }

    if (status === 429) {
        return AUTH_ERROR_MESSAGES['too many code requests, try again later']
            || 'Слишком много запросов кода. Попробуйте позже';
    }

    return 'Не удалось выполнить запрос';
}
