/** Public URL for a category or product slug (no type prefix). */
export function entityPath(slug: string | undefined | null): string {
    if (!slug) return '#';
    return `/${slug}`;
}
