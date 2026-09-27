export type CatalogEntity = {
    type: 'category' | 'product';
    slug: string;
};

/** Current category/product resolved for `/{slug}` pages. */
export function useCatalogEntity() {
    return useState<CatalogEntity | null>('catalog-entity', () => null);
}
