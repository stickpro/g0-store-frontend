export default defineEventHandler((event) => {
    const origin = getSiteOrigin(event);
    return sendSitemapXml(event, renderUrlSet(
        origin,
        SITEMAP_STATIC_PATHS.map((path) => ({ path })),
    ));
});
