export default defineEventHandler(async (event) => {
    const origin = getSiteOrigin(event);
    const entries = await createSitemapApi(event).getProducts();
    return sendSitemapXml(event, renderUrlSet(origin, toProductPaths(entries)));
});
