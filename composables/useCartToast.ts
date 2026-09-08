export function useCartToast() {
  const message = useState('cart-toast-message', () => '');
  const kind = useState<'success' | 'error'>('cart-toast-kind', () => 'success');
  const visible = useState('cart-toast-visible', () => false);

  let hideTimer: ReturnType<typeof setTimeout> | undefined;

  function dismiss() {
    visible.value = false;
    if (hideTimer) clearTimeout(hideTimer);
  }

  function show(text: string, next: 'success' | 'error' = 'success') {
    message.value = text;
    kind.value = next;
    visible.value = true;
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      visible.value = false;
    }, 4000);
  }

  function added() {
    show('Товар добавлен в корзину');
  }

  function failed() {
    show('Не удалось добавить в корзину', 'error');
  }

  return {
    message,
    kind,
    visible,
    show,
    added,
    failed,
    dismiss,
  };
}
