import { STOCK_STATUS } from '~/utils/constants/stockStatus';
import { CURRENCY_CODE } from '~/utils/constants/currency';

export function seoPlainText(value?: string | null, max = 160): string {
    if (!value) return '';
    const text = value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length <= max) return text;
    return `${text.slice(0, max - 1).trimEnd()}…`;
}

export function seoAbsoluteUrl(base: string, path?: string | null): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const origin = base.replace(/\/$/, '');
    return `${origin}/${String(path).replace(/^\//, '')}`;
}

export function seoAvailability(status?: string | null): string {
    if (status === STOCK_STATUS.OUT_OF_STOCK) return 'https://schema.org/OutOfStock';
    if (status === STOCK_STATUS.PRE_ORDER) return 'https://schema.org/PreOrder';
    return 'https://schema.org/InStock';
}

export function seoParsePrice(value: unknown): string | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) return value.toFixed(2);
    if (typeof value === 'string' && value.trim()) {
        const parsed = Number(value.replace(',', '.'));
        if (Number.isFinite(parsed)) return parsed.toFixed(2);
    }
    return undefined;
}

export function buildProductJsonLd(input: {
    name: string;
    description?: string;
    url: string;
    images: string[];
    sku?: string;
    mpn?: string;
    ean?: string;
    price?: string;
    availability: string;
    reviewCount: number;
    ratingValue?: number;
}): Record<string, unknown> {
    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: input.name,
        url: input.url,
    };

    if (input.description) data.description = input.description;
    if (input.images.length) data.image = input.images;
    if (input.sku) data.sku = input.sku;
    if (input.mpn) data.mpn = input.mpn;
    if (input.ean) data.gtin13 = input.ean;

    if (input.price) {
        data.offers = {
            '@type': 'Offer',
            url: input.url,
            priceCurrency: CURRENCY_CODE,
            price: input.price,
            availability: input.availability,
            itemCondition: 'https://schema.org/NewCondition',
        };
    }

    if (input.reviewCount > 0 && input.ratingValue) {
        data.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: Number(input.ratingValue.toFixed(1)),
            reviewCount: input.reviewCount,
            bestRating: 5,
            worstRating: 1,
        };
    }

    return data;
}

export function buildCollectionPageJsonLd(input: {
    name: string;
    description?: string;
    url: string;
    image?: string;
    items: { name: string; url: string }[];
    numberOfItems?: number;
}): Record<string, unknown> {
    const data: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: input.name,
        url: input.url,
        mainEntity: {
            '@type': 'ItemList',
            numberOfItems: input.numberOfItems ?? input.items.length,
            itemListElement: input.items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.name,
                url: item.url,
            })),
        },
    };

    if (input.description) data.description = input.description;
    if (input.image) data.image = input.image;

    return data;
}

export function buildBreadcrumbJsonLd(
    origin: string,
    items: { title: string; url: string }[],
): Record<string, unknown> {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.title,
            item: seoAbsoluteUrl(origin, item.url),
        })),
    };
}
