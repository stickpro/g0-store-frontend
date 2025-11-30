import { CURRENCY_SYMBOL } from '../constants/currency';

/**
 * Форматирование цены в рублях
 * @param price - цена в числовом формате
 * @param showSymbol - показывать ли символ валюты (по умолчанию true)
 * @returns отформатированная строка цены
 *
 * @example
 * formatPrice(1234567.89) // "1 234 567,89 ₽"
 * formatPrice(1234567.89, false) // "1 234 567,89"
 * formatPrice(1000) // "1 000 ₽"
 */
export const formatPrice = (price: number, showSymbol: boolean = true): string => {
    const formatted = new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);

    return showSymbol ? `${formatted} ${CURRENCY_SYMBOL}` : formatted;
};

/**
 * Форматирование цены с сокращением (K, M)
 * @param price - цена в числовом формате
 * @param showSymbol - показывать ли символ валюты (по умолчанию true)
 * @returns отформатированная строка цены с сокращением
 *
 * @example
 * formatPriceCompact(1500000) // "1,5M ₽"
 * formatPriceCompact(50000) // "50K ₽"
 * formatPriceCompact(999) // "999 ₽"
 */
export const formatPriceCompact = (price: number, showSymbol: boolean = true): string => {
    const formatted = new Intl.NumberFormat('ru-RU', {
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
    }).format(price);

    return showSymbol ? `${formatted} ${CURRENCY_SYMBOL}` : formatted;
};

/**
 * Форматирование диапазона цен
 * @param minPrice - минимальная цена
 * @param maxPrice - максимальная цена
 * @param showSymbol - показывать ли символ валюты (по умолчанию true)
 * @returns отформатированная строка диапазона цен
 *
 * @example
 * formatPriceRange(1000, 5000) // "1 000 - 5 000 ₽"
 */
export const formatPriceRange = (minPrice: number, maxPrice: number, showSymbol: boolean = true): string => {
    const min = new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(minPrice);

    const max = new Intl.NumberFormat('ru-RU', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(maxPrice);

    return showSymbol ? `${min} - ${max} ${CURRENCY_SYMBOL}` : `${min} - ${max}`;
};
