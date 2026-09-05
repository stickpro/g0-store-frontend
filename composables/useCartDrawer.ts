export const useCartDrawer = () => {
  const isOpen = useState('cart-drawer-open', () => false)

  const openCart = () => {
    isOpen.value = true
  }

  const closeCart = () => {
    isOpen.value = false
  }

  const toggleCart = () => {
    isOpen.value = !isOpen.value
  }

  return {
    isOpen,
    openCart,
    closeCart,
    toggleCart,
  }
}
