import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

marked.setOptions({
    gfm: true,
    breaks: true,
});

/** Render markdown to sanitized HTML (SSR-safe). */
export function renderMarkdown(source?: string | null): string {
    if (!source?.trim()) return '';

    const html = marked.parse(source, { async: false }) as string;
    return DOMPurify.sanitize(html, {
        USE_PROFILES: { html: true },
    });
}
