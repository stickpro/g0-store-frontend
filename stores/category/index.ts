import { defineStore } from 'pinia';
import type { GithubComStickproGoStoreInternalDtoCategoryTreeDTO } from "~/repository/types/api/generatedApiGo";

type State = {
    tree: GithubComStickproGoStoreInternalDtoCategoryTreeDTO[];
    loading: boolean;
    loaded: boolean;
}

export const useCategoryStore = defineStore('Category', {
    state: (): State => ({
        tree: [],
        loading: false,
        loaded: false,
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

        /**
         * Clear category cache
         */
        clearCache() {
            this.tree = [];
            this.loaded = false;
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
    }
});
