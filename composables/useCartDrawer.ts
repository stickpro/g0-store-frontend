export const useCartDrawer = () => {
  const isOpen = useState('cart-drawer-open', () => false)

  const closeCart = () => {
    isOpen.value = false
  }

  const openCart = () => {
    const { closeSidebar } = useSidebar()
    closeSidebar()
    isOpen.value = true
  }

  const toggleCart = () => {
    if (isOpen.value) {
      closeCart()
    } else {
      openCart()
    }
  }

  return {
    isOpen,
    openCart,
    closeCart,
    toggleCart,
  }
}
