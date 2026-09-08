import type { H3Event } from 'h3';
import type { SitemapEntry } from '~/repository/types/api/generatedApiGo';
import SitemapModule from '~/repository/modules/sitemap';

export const SITEMAP_STATIC_PATHS = [
    '/',
    '/category',
    '/dostavka',
    '/warranty',
    '/contacts',
] as const;

export function getSiteOrigin(event: H3Event): string {
    const config = useRuntimeConfig(event);
    const configured = String(config.public.siteUrl || '').replace(/\/$/, '');
    if (configured) return configured;
    return getRequestURL(event).origin;
}

export function createSitemapApi(event: H3Event) {
    const config = useRuntimeConfig(event);
    return new SitemapModule({ baseURL: String(config.public.apiUrl) });
}

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function toLastmod(value?: string): string | undefined {
    if (!value) return undefined;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toISOString();
}

export function renderUrlSet(origin: string, entries: Array<{ path: string; updatedAt?: string }>): string {
    const urls = entries.map(({ path, updatedAt }) => {
        const loc = `${origin}${path.startsWith('/') ? path : `/${path}`}`;
        const lastmod = toLastmod(updatedAt);
        const lastmodTag = lastmod ? `\n    <lastmod>${escapeXml(lastmod)}</lastmod>` : '';
        return `  <url>\n    <loc>${escapeXml(loc)}</loc>${lastmodTag}\n  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function renderSitemapIndex(origin: string, paths: string[]): string {
    const sitemaps = paths.map((path) => {
        const loc = `${origin}${path.startsWith('/') ? path : `/${path}`}`;
        return `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n  </sitemap>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>\n`;
}

export function toCategoryPaths(entries: SitemapEntry[]): Array<{ path: string; updatedAt?: string }> {
    return entries.map((entry) => ({
        path: `/category/${entry.slug}`,
        updatedAt: entry.updated_at,
    }));
}

export function toProductPaths(entries: SitemapEntry[]): Array<{ path: string; updatedAt?: string }> {
    return entries.map((entry) => ({
        path: `/product/${entry.slug}`,
        updatedAt: entry.updated_at,
    }));
}

export function sendSitemapXml(event: H3Event, xml: string) {
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
    setHeader(event, 'Cache-Control', 'public, max-age=3600');
    return xml;
}
