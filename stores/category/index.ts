import { defineStore } from 'pinia';
import type {
    BreadcrumbDTO,
    CategoryResponse,
    CategoryTreeDTO,
    FullPagingData,
    GithubComStickproGoStoreInternalDtoCategoryFiltersDTO,
    GithubComStickproGoStoreInternalDtoEnrichedVariantDTO,
} from "~/repository/types/api/generatedApiGo";
import type { CategoryProductsParams } from '~/repository/modules/category';

type ProductsState = {
    items: GithubComStickproGoStoreInternalDtoEnrichedVariantDTO[];
    pagination: FullPagingData | null;
}

type State = {
    tree: CategoryTreeDTO[];
    loading: boolean;
    loaded: boolean;
    details: Record<string, CategoryResponse>;
    detailsLoading: Record<string, boolean>;
    products: Record<string, ProductsState>;
    productsLoading: Record<string, boolean>;
    filters: Record<string, GithubComStickproGoStoreInternalDtoCategoryFiltersDTO>;
    filtersLoading: Record<string, boolean>;
    breadcrumbs: Record<string, BreadcrumbDTO[]>;
}

export const useCategoryStore = defineStore('Category', {
    state: (): State => ({
        tree: [],
        loading: false,
        loaded: false,
        details: {},
        detailsLoading: {},
        products: {},
        productsLoading: {},
        filters: {},
        filtersLoading: {},
        breadcrumbs: {},
    }),

    actions: {
        /**
         * Load category tree from API
         */
        async loadTree() {
            if (!import.meta.client) return;

            // Return cached data if already loaded
            if (this.loaded) {
                return this.tree;
            }

            const { $api } = useNuxtApp();
            this.loading = true;

            try {
                const tree = await $api.category.getTree();
                this.tree = tree;
                this.loaded = true;
                return tree;
            } catch (error) {
                console.error('Error loading category tree:', error);
                return [];
            } finally {
                this.loading = false;
            }
        },

        async loadBySlug(slug: string) {
            if (this.details[slug]) {
                return this.details[slug];
            }

            const { $api } = useNuxtApp();
            this.detailsLoading[slug] = true;

            try {
                const category = await $api.category.getBySlug(slug);
                this.details[slug] = category;
                return category;
            } catch (error) {
                console.error('Error loading category by slug:', error);
                throw error;
            } finally {
                this.detailsLoading[slug] = false;
            }
        },

        async loadBreadcrumbs(slug: string) {
            if (this.breadcrumbs[slug]) {
                return this.breadcrumbs[slug];
            }

            const { $api } = useNuxtApp();

            try {
                const breadcrumbs = await $api.category.getBreadcrumbs(slug);
                this.breadcrumbs[slug] = breadcrumbs;
                return breadcrumbs;
            } catch (error) {
                console.error('Error loading category breadcrumbs:', error);
                throw error;
            }
        },

        async loadFilters(slug: string, force = false) {
            if (!force && this.filters[slug]) {
                return this.filters[slug];
            }

            const { $api } = useNuxtApp();
            this.filtersLoading[slug] = true;

            try {
                const filters = await $api.category.getFilters(slug);
                this.filters[slug] = filters;
                return filters;
            } catch (error) {
                console.error('Error loading category filters:', error);
                throw error;
            } finally {
                this.filtersLoading[slug] = false;
            }
        },

        async loadProducts(
            slug: string,
            page = 1,
            pageSize = 15,
            append = false,
            filters: CategoryProductsParams = {},
        ) {
            const { $api } = useNuxtApp();
            this.productsLoading[slug] = true;

            try {
                const response = await $api.category.getProducts(slug, {
                    ...filters,
                    page,
                    page_size: pageSize,
                });

                const previous = append ? (this.products[slug]?.items || []) : [];
                this.products[slug] = {
                    items: [...previous, ...(response.items || [])],
                    pagination: response.pagination || null,
                };

                return this.products[slug];
            } catch (error) {
                console.error('Error loading category products:', error);
                throw error;
            } finally {
                this.productsLoading[slug] = false;
            }
        },

        /**
         * Clear category cache
         */
        clearCache() {
            this.tree = [];
            this.loaded = false;
            this.details = {};
            this.products = {};
            this.filters = {};
            this.breadcrumbs = {};
        }
    },

    getters: {
        /**
         * Get category tree
         */
        getTree: (state) => state.tree,

        /**
         * Check if categories are loading
         */
        isLoading: (state) => state.loading,

        getBySlug: (state) => (slug: string) => state.details[slug] || null,

        isDetailsLoading: (state) => (slug: string) => state.detailsLoading[slug] || false,

        getProducts: (state) => (slug: string) => state.products[slug]?.items || [],

        getProductsPagination: (state) => (slug: string) => state.products[slug]?.pagination || null,

        isProductsLoading: (state) => (slug: string) => state.productsLoading[slug] || false,

        getFilters: (state) => (slug: string) => state.filters[slug] || null,

        isFiltersLoading: (state) => (slug: string) => state.filtersLoading[slug] || false,

        getBreadcrumbs: (state) => (slug: string) => state.breadcrumbs[slug] || [],
    }
});
