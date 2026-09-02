import type { LocationQuery } from 'vue-router';
import type { CategoryProductsParams } from '~/repository/modules/category';

const PRODUCT_FILTER_KEYS = [
    'price_min',
    'price_max',
    'manufacturer_id',
    'stock_status',
    'sort',
] as const;

function queryToString(value: LocationQuery[string]): string | undefined {
    if (Array.isArray(value)) {
        const joined = value.filter(Boolean).join(',');
        return joined || undefined;
    }
    if (value == null || value === '') return undefined;
    return String(value);
}

export function categoryProductsParamsFromQuery(query: LocationQuery): CategoryProductsParams {
    const params: CategoryProductsParams = {};

    for (const key of PRODUCT_FILTER_KEYS) {
        const value = queryToString(query[key]);
        if (value) params[key] = value;
    }

    for (const [key, raw] of Object.entries(query)) {
        if (!key.startsWith('attr.')) continue;
        const value = queryToString(raw);
        if (value) params[key] = value;
    }

    return params;
}

export function categoryFilterQueryKey(query: LocationQuery): string {
    return JSON.stringify(categoryProductsParamsFromQuery(query));
}
