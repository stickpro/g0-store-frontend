import { defineStore } from 'pinia';
import type { Collection, FullPagingData, CollectionWithProductResponse } from "~/repository/types/api/generatedApiGo";

type State = {
    collections: Collection[];
    collectionsWithProducts: Record<string, CollectionWithProductResponse>;
    loadingStates: Record<string, boolean>;
    pagination: FullPagingData | null
    loading: boolean;
}

export const useCollectionStore = defineStore('Collection', {
    state: (): State => {
        return {
            collections: [],
            collectionsWithProducts: {},
            loadingStates: {},
            pagination: null,
            loading: false,
        }
    },

    actions: {
        async loadCollections(params?: {
            page?: number;
            page_size?: number;
            search?: string;
        }) {
            if (!import.meta.client) return;

            const { $api } = useNuxtApp();
            this.loading = true;

            try {
                const response = await $api.collection.getAll(params);
                this.collections = response.items;
                this.pagination = response.pagination || null;
            } catch (error) {
                console.error('Error loading collections:', error);
            } finally {
                this.loading = false;
            }
        },

        async loadCollectionById(id: string) {
            if (!import.meta.client) return;

            // Если коллекция уже загружена, не загружаем заново
            if (this.collectionsWithProducts[id]) {
                return this.collectionsWithProducts[id];
            }

            const { $api } = useNuxtApp();
            this.loadingStates[id] = true;

            try {
                const collection = await $api.collection.getById(id);
                this.collectionsWithProducts[id] = collection;
                return collection;
            } catch (error) {
                console.error('Error loading collection by id:', error);
            } finally {
                this.loadingStates[id] = false;
            }
        },

        async loadCollectionBySlug(slug: string) {
            if (!import.meta.client) return;

            // Если коллекция уже загружена, не загружаем заново
            if (this.collectionsWithProducts[slug]) {
                return this.collectionsWithProducts[slug];
            }

            const { $api } = useNuxtApp();
            this.loadingStates[slug] = true;

            try {
                const collection = await $api.collection.getBySlug(slug);
                this.collectionsWithProducts[slug] = collection;
                return collection;
            } catch (error) {
                console.error('Error loading collection by slug:', error);
            } finally {
                this.loadingStates[slug] = false;
            }
        },

        clearCollection(key: string) {
            const { [key]: _, ...restCollections } = this.collectionsWithProducts;
            const { [key]: __, ...restLoadingStates } = this.loadingStates;
            this.collectionsWithProducts = restCollections;
            this.loadingStates = restLoadingStates;
        },

        clearAllCollections() {
            this.collectionsWithProducts = {};
            this.loadingStates = {};
        }
    },

    getters: {
        getCollectionBySlug: (state) => (slug: string) => {
            return state.collections.find(c => c.slug === slug);
        },

        getCollectionWithProducts: (state) => (key: string) => {
            return state.collectionsWithProducts[key] || null;
        },

        isCollectionLoading: (state) => (key: string) => {
            return state.loadingStates[key] || false;
        }
    }
});
