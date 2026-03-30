import { defineStore } from 'pinia';
import type { AddCartItemRequest, CartItemResponse } from "~/repository/types/api/generatedApiGo";

type State = {
    items: CartItemResponse[];
    totalPrice: number;
    loading: boolean;
}

export const useCartStore = defineStore('Cart', {
    state: (): State => ({
        items: [],
        totalPrice: 0,
        loading: false,
    }),

    actions: {
        async loadCart() {
            if (!import.meta.client) return;

            const { $api } = useNuxtApp();
            this.loading = true;

            try {
                const cart = await $api.cart.getCart();
                this.items = cart.items || [];
                this.totalPrice = cart.total_price || 0;
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
                const cart = await $api.cart.addItem(request);
                this.items = cart.items || [];
                this.totalPrice = cart.total_price || 0;
            } catch (error) {
                console.error('Error adding item to cart:', error);
                throw error;
            }
        },

        async updateItem(variantId: string, quantity: number) {
            if (!import.meta.client) return;

            const { $api } = useNuxtApp();

            try {
                const cart = await $api.cart.updateItem(variantId, { quantity });
                this.items = cart.items || [];
                this.totalPrice = cart.total_price || 0;
            } catch (error) {
                console.error('Error updating cart item:', error);
                throw error;
            }
        },

        async removeItem(variantId: string) {
            if (!import.meta.client) return;

            const { $api } = useNuxtApp();

            try {
                const cart = await $api.cart.removeItem(variantId);
                this.items = cart.items || [];
                this.totalPrice = cart.total_price || 0;
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
    },

    getters: {
        itemCount: (state) => state.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
        isEmpty: (state) => state.items.length === 0,
        getItemByVariantId: (state) => (variantId: string) =>
            state.items.find(item => item.variant_id === variantId),
    },
});
