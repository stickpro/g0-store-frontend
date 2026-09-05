import { defineStore } from 'pinia';
import type { AddCartItemRequest, CartItemResponse, CartResponse } from "~/repository/types/api/generatedApiGo";

type State = {
    items: CartItemResponse[];
    totalPrice: number;
    loading: boolean;
}

function parsePrice(value: unknown): number {
    const n = typeof value === 'string' ? Number(value.replace(',', '.')) : Number(value);
    return Number.isFinite(n) ? n : 0;
}

export const useCartStore = defineStore('Cart', {
    state: (): State => ({
        items: [],
        totalPrice: 0,
        loading: false,
    }),

    actions: {
        async loadCart() {
            const { $api } = useNuxtApp();
            this.loading = true;

            try {
                this.applyCart(await $api.cart.getCart());
            } catch (error) {
                console.error('Error loading cart:', error);
            } finally {
                this.loading = false;
            }
        },

        async addItem(request: AddCartItemRequest) {
            if (!import.meta.client) return;

            const { $api } = useNuxtApp();

            try {
                this.applyCart(await $api.cart.addItem(request));
            } catch (error) {
                console.error('Error adding item to cart:', error);
                throw error;
            }
        },

        async updateItem(variantId: string, quantity: number) {
            if (!import.meta.client) return;

            const { $api } = useNuxtApp();

            try {
                this.applyCart(await $api.cart.updateItem(variantId, { quantity }));
            } catch (error) {
                console.error('Error updating cart item:', error);
                throw error;
            }
        },

        async removeItem(variantId: string) {
            if (!import.meta.client) return;

            const { $api } = useNuxtApp();

            try {
                this.applyCart(await $api.cart.removeItem(variantId));
            } catch (error) {
                console.error('Error removing cart item:', error);
                throw error;
            }
        },

        async clearCart() {
            if (!import.meta.client) return;

            const { $api } = useNuxtApp();

            try {
                await $api.cart.clearCart();
                this.items = [];
                this.totalPrice = 0;
            } catch (error) {
                console.error('Error clearing cart:', error);
                throw error;
            }
        },

        applyCart(cart: CartResponse) {
            this.items = cart.items || [];
            this.totalPrice = parsePrice(cart.total_price);
        },
    },

    getters: {
        itemCount: (state) => state.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
        isEmpty: (state) => state.items.length === 0,
        getItemByVariantId: (state) => (variantId: string) =>
            state.items.find(item => item.variant_id === variantId),
    },
});
