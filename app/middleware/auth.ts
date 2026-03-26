import { AUTH_EXIGE_LOGIN } from '~/composables/useAuth'

/**
 * Middleware: auth
 * Protege rotas que exigem autenticação (somente quando AUTH_EXIGE_LOGIN é true).
 */
export default defineNuxtRouteMiddleware(async () => {
  if (!AUTH_EXIGE_LOGIN) return

  const { autenticado, buscarUsuario } = useAuth()

  if (!autenticado.value) {
    await buscarUsuario()
  }

  if (!autenticado.value) {
    return navigateTo('/login')
  }
})
