export default defineEventHandler((event) => {
    const origin = getSiteOrigin(event);
    return sendSitemapXml(event, renderSitemapIndex(origin, [
        '/sitemap-static.xml',
        '/sitemap-categories.xml',
        '/sitemap-products.xml',
    ]));
});
