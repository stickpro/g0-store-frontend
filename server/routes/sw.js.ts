/** Browsers/extensions often probe /sw.js; keep it out of pages/[slug].vue. */
export default defineEventHandler((event) => {
    setResponseStatus(event, 404);
    setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
    setHeader(event, 'Cache-Control', 'no-store');
    return 'Not Found';
});
