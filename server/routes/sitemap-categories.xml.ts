export default defineEventHandler(async (event) => {
    const origin = getSiteOrigin(event);
    const entries = await createSitemapApi(event).getCategories();
    return sendSitemapXml(event, renderUrlSet(origin, toCategoryPaths(entries)));
});
