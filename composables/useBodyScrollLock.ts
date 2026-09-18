const SCROLLBAR_VAR = '--scrollbar-compensation'

export function useBodyScrollLock() {
  function setBodyScrollLocked(locked: boolean) {
    if (!import.meta.client) return

    if (locked) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      const pad = scrollbarWidth > 0 ? `${scrollbarWidth}px` : '0px'
      document.documentElement.style.overflow = 'hidden'
      document.documentElement.style.setProperty(SCROLLBAR_VAR, pad)
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = scrollbarWidth > 0 ? pad : ''
    } else {
      document.documentElement.style.overflow = ''
      document.documentElement.style.removeProperty(SCROLLBAR_VAR)
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }

  return { setBodyScrollLocked }
}
