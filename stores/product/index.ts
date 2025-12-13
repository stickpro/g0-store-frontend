import { defineStore } from 'pinia';
import type { ProductWithMediumResponse, ShortProduct } from "~/repository/types/api/generatedApiGo";

const CACHE_SIZE = 10;

type CacheEntry = {
    data: ProductWithMediumResponse;
    timestamp: number;
}

type State = {
    products: Record<string, CacheEntry>;
    accessOrder: string[]; // LRU (Least Recently Used) - порядок доступа
    loadingStates: Record<string, boolean>;
    relatedProducts: Record<string, ShortProduct[]>; // Связанные товары по slug
    relatedProductsLoading: Record<string, boolean>;
}

export const useProductStore = defineStore('Product', {
    state: (): State => {
        return {
            products: {},
            accessOrder: [],
            loadingStates: {},
            relatedProducts: {},
            relatedProductsLoading: {},
        }
    },

    actions: {
        /**
         * Обновить порядок доступа для LRU кэша
         */
        updateAccessOrder(slug: string) {
            // Удаляем slug из текущей позиции
            const index = this.accessOrder.indexOf(slug);
            if (index > -1) {
                this.accessOrder.splice(index, 1);
            }
            // Добавляем в конец (самый недавно использованный)
            this.accessOrder.push(slug);
        },

        /**
         * Вытеснить наименее используемый товар
         */
        evictLRU() {
            if (this.accessOrder.length >= CACHE_SIZE) {
                // Удаляем самый старый элемент (первый в массиве)
                const oldestSlug = this.accessOrder.shift();
                if (oldestSlug) {
                    const { [oldestSlug]: _, ...restProducts } = this.products;
                    const { [oldestSlug]: __, ...restLoadingStates } = this.loadingStates;
                    this.products = restProducts;
                    this.loadingStates = restLoadingStates;
                }
            }
        },

        /**
         * Загрузить товар по slug
         * @param slug - уникальный идентификатор товара в URL
         * @returns ProductWithMediumResponse или undefined
         */
        async loadProductBySlug(slug: string) {
            if (!import.meta.client) return;

            // Если товар уже загружен, обновляем порядок доступа и возвращаем
            if (this.products[slug]) {
                this.updateAccessOrder(slug);
                return this.products[slug].data;
            }

            const { $api } = useNuxtApp();
            this.loadingStates[slug] = true;

            try {
                const product = await $api.product.getBySlug(slug);

                // Вытесняем старый элемент если кэш переполнен
                this.evictLRU();

                // Сохраняем товар с меткой времени
                this.products[slug] = {
                    data: product,
                    timestamp: Date.now()
                };

                // Обновляем порядок доступа
                this.updateAccessOrder(slug);

                return product;
            } catch (error) {
                console.error('Error loading product by slug:', error);
                throw error;
            } finally {
                this.loadingStates[slug] = false;
            }
        },

        /**
         * Очистить товар из кэша
         * @param slug - slug товара для удаления
         */
        clearProduct(slug: string) {
            const { [slug]: _, ...restProducts } = this.products;
            const { [slug]: __, ...restLoadingStates } = this.loadingStates;
            this.products = restProducts;
            this.loadingStates = restLoadingStates;

            // Удаляем из порядка доступа
            const index = this.accessOrder.indexOf(slug);
            if (index > -1) {
                this.accessOrder.splice(index, 1);
            }
        },

        /**
         * Очистить все товары из кэша
         */
        clearAllProducts() {
            this.products = {};
            this.loadingStates = {};
            this.accessOrder = [];
        },

        /**
         * Получить информацию о кэше
         */
        getCacheInfo() {
            return {
                size: Object.keys(this.products).length,
                maxSize: CACHE_SIZE,
                accessOrder: [...this.accessOrder],
                products: Object.keys(this.products)
            };
        },

        /**
         * Загрузить связанные товары по slug
         * @param slug - уникальный идентификатор товара в URL
         * @returns ShortProduct[] или пустой массив
         */
        async loadRelatedProducts(slug: string) {
            if (!import.meta.client) return;

            // Если связанные товары уже загружены, возвращаем их
            if (this.relatedProducts[slug]) {
                return this.relatedProducts[slug];
            }

            const { $api } = useNuxtApp();
            this.relatedProductsLoading[slug] = true;

            try {
                const products = await $api.product.getRelatedProductBySlug(slug);
                this.relatedProducts[slug] = products;
                return products;
            } catch (error) {
                console.error('Error loading related products:', error);
                return [];
            } finally {
                this.relatedProductsLoading[slug] = false;
            }
        }
    },

    getters: {
        /**
         * Получить товар по slug из кэша
         */
        getProductBySlug: (state) => (slug: string) => {
            return state.products[slug]?.data || null;
        },

        /**
         * Проверить, загружается ли товар
         */
        isProductLoading: (state) => (slug: string) => {
            return state.loadingStates[slug] || false;
        },

        /**
         * Получить количество товаров в кэше
         */
        cacheSize: (state) => {
            return Object.keys(state.products).length;
        },

        /**
         * Проверить, заполнен ли кэш
         */
        isCacheFull: (state) => {
            return Object.keys(state.products).length >= CACHE_SIZE;
        },

        /**
         * Получить связанные товары по slug
         */
        getRelatedProducts: (state) => (slug: string) => {
            return state.relatedProducts[slug] || [];
        },

        /**
         * Проверить, загружаются ли связанные товары
         */
        isRelatedProductsLoading: (state) => (slug: string) => {
            return state.relatedProductsLoading[slug] || false;
        }
    }
});
