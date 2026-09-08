export default defineEventHandler((event) => {
    const origin = getSiteOrigin(event);
    setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
    return [
        'User-agent: *',
        'Disallow: /account',
        'Disallow: /cart',
        'Disallow: /checkout',
        '',
        `Sitemap: ${origin}/sitemap.xml`,
        '',
    ].join('\n');
});
