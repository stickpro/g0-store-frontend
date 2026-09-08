import HttpFactory from "../factory";
import type {
    JSONResponseArraySitemapEntry,
    SitemapEntry,
} from "~/repository/types/api/generatedApiGo";

function withSlugs(entries: SitemapEntry[] | undefined): SitemapEntry[] {
    return (entries || []).filter((entry): entry is SitemapEntry & { slug: string } => Boolean(entry.slug));
}

class SitemapModule extends HttpFactory {
    private RESOURCE = '/sitemap'

    async getProducts(): Promise<SitemapEntry[]> {
        const response = await this.get<JSONResponseArraySitemapEntry>(`${this.RESOURCE}/products`);
        return withSlugs(response.data);
    }

    async getCategories(): Promise<SitemapEntry[]> {
        const response = await this.get<JSONResponseArraySitemapEntry>(`${this.RESOURCE}/categories`);
        return withSlugs(response.data);
    }
}

export default SitemapModule;
