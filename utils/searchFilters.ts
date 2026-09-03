import { STOCK_STATUS } from '~/utils/constants/stockStatus';

export function stockStatusParam(hideOutOfStock: boolean, inStore: boolean): string | undefined {
    if (inStore) return STOCK_STATUS.IN_STOCK;
    if (hideOutOfStock) return `${STOCK_STATUS.IN_STOCK},${STOCK_STATUS.PRE_ORDER}`;
    return undefined;
}

export function stockFlagsFromParam(value?: string) {
    const selected = (value || '').split(',').filter(Boolean);
    const inStore = selected.length === 1 && selected[0] === STOCK_STATUS.IN_STOCK;
    const hideOutOfStock = inStore
        || (selected.includes(STOCK_STATUS.IN_STOCK)
            && selected.includes(STOCK_STATUS.PRE_ORDER)
            && !selected.includes(STOCK_STATUS.OUT_OF_STOCK));

    return { hideOutOfStock, inStore };
}
