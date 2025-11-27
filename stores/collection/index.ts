import { defineStore } from 'pinia';
import type { Collection, CollectionResponse } from "~/repository/types/api/generatedApiGo";

type State = {
    collections: Collection[];
    currentCollection: CollectionResponse | null;
    pagination: {
        page: number;
        page_size: number;
        total: number;
        last_page: number;
    } | null;
    loading: boolean;
}

export const useCollectionStore = defineStore('Collection', {
    state: (): State => {
        return {
            collections: [],
            currentCollection: null,
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

            const { $api } = useNuxtApp();
            this.loading = true;

            try {
                this.currentCollection = await $api.collection.getById(id);
            } catch (error) {
                console.error('Error loading collection by id:', error);
            } finally {
                this.loading = false;
            }
        },

        async loadCollectionBySlug(slug: string) {
            if (!import.meta.client) return;

            const { $api } = useNuxtApp();
            this.loading = true;

            try {
                this.currentCollection = await $api.collection.getBySlug(slug);
            } catch (error) {
                console.error('Error loading collection by slug:', error);
            } finally {
                this.loading = false;
            }
        },

        clearCurrentCollection() {
            this.currentCollection = null;
        }
    },

    getters: {
        getCollectionBySlug: (state) => (slug: string) => {
            return state.collections.find(c => c.slug === slug);
        },
    }
});
