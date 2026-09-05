import { useCartStore } from '~/stores/cart';

export function useCartQuantity() {
    const cartStore = useCartStore();
    const quantityDrafts = ref<Record<string, string>>({});
    const focusedVariantId = ref<string | null>(null);
    const pendingByVariant = new Map<string, Promise<void>>();

    function quantityValue(variantId?: string, quantity?: number) {
        if (variantId && focusedVariantId.value === variantId && quantityDrafts.value[variantId] !== undefined) {
            return quantityDrafts.value[variantId];
        }
        return String(quantity ?? 1);
    }

    function onQuantityFocus(variantId: string, quantity?: number) {
        focusedVariantId.value = variantId;
        quantityDrafts.value[variantId] = String(quantity ?? 1);
    }

    function onQuantityInput(variantId: string, event: Event) {
        const target = event.target as HTMLInputElement;
        quantityDrafts.value[variantId] = target.value.replace(/\D/g, '');
    }

    async function waitPending(variantId: string) {
        const pending = pendingByVariant.get(variantId);
        if (pending) await pending;
    }

    function queuePending(variantId: string, task: Promise<void>) {
        pendingByVariant.set(variantId, task);
        return task.finally(() => {
            if (pendingByVariant.get(variantId) === task) pendingByVariant.delete(variantId);
        });
    }

    function clampQuantity(value: number, max?: number) {
        if (max && value > max) return max;
        return value;
    }

    async function applyQuantity(variantId: string, next: number, current: number) {
        if (next <= 0) {
            await cartStore.removeItem(variantId);
            return;
        }
        if (next === current) return;
        await cartStore.updateItem(variantId, next);
    }

    async function commitQuantity(variantId?: string, current?: number, max?: number) {
        if (!variantId) return;
        if (focusedVariantId.value === variantId) focusedVariantId.value = null;

        const raw = quantityDrafts.value[variantId];
        delete quantityDrafts.value[variantId];
        if (raw === undefined || raw === '') return;

        const parsed = Number.parseInt(raw, 10);
        if (!Number.isFinite(parsed)) return;

        await queuePending(variantId, applyQuantity(variantId, clampQuantity(parsed, max), current ?? 1));
    }

    function onQuantityEnter(event: KeyboardEvent) {
        (event.target as HTMLInputElement).blur();
    }

    async function decrease(variantId: string) {
        await waitPending(variantId);
        const item = cartStore.getItemByVariantId(variantId);
        if (!item) return;
        await applyQuantity(variantId, (item.quantity ?? 1) - 1, item.quantity ?? 1);
    }

    async function increase(variantId: string) {
        await waitPending(variantId);
        const item = cartStore.getItemByVariantId(variantId);
        if (!item) return;
        const current = item.quantity ?? 1;
        await applyQuantity(variantId, clampQuantity(current + 1, item.max_quantity), current);
    }

    return {
        quantityValue,
        onQuantityFocus,
        onQuantityInput,
        commitQuantity,
        onQuantityEnter,
        decrease,
        increase,
    };
}
