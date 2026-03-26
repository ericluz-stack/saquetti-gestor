/**
 * Tema claro/escuro global: classe `dark` no <html> + sync no DOM (cliente).
 * Padrão: modo claro (isDark = false).
 *
 * - Chame `registerAppColorModeHead()` uma vez em app.vue (useHead + watch).
 * - Use `useAppColorMode()` em layouts/páginas para ler `isDark` e `toggle`.
 */

const STATE_KEY = 'app.isDark' as const

const LS_KEY = 'saquetti-dark-mode'

export function registerAppColorModeHead() {
  const isDark = useState<boolean>(STATE_KEY, () => false)

  // Carrega preferência salva no primeiro render client-side
  if (import.meta.client) {
    isDark.value = localStorage.getItem(LS_KEY) === 'true'
  }

  useHead(
    computed(() => ({
      htmlAttrs: {
        class: isDark.value ? 'dark' : undefined,
      },
    })),
  )

  watch(
    isDark,
    (dark) => {
      if (import.meta.client) {
        document.documentElement.classList.toggle('dark', dark)
        localStorage.setItem(LS_KEY, String(dark)) // persiste para próximos reloads
      }
    },
    { immediate: true },
  )
}

export function useAppColorMode() {
  const isDark = useState<boolean>(STATE_KEY, () => false)

  function toggle() {
    isDark.value = !isDark.value
  }

  function setDark(value: boolean) {
    isDark.value = value
  }

  return {
    isDark: readonly(isDark),
    toggle,
    setDark,
  }
}
