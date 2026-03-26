import { AUTH_EXIGE_LOGIN } from '~/composables/useAuth'

/**
 * Middleware: guest
 * Redireciona usuários autenticados para longe de login/recuperação (somente com AUTH_EXIGE_LOGIN).
 */
export default defineNuxtRouteMiddleware(async () => {
  if (!AUTH_EXIGE_LOGIN) return

  const { autenticado, buscarUsuario } = useAuth()

  if (!autenticado.value) {
    await buscarUsuario()
  }

  if (autenticado.value) {
    return navigateTo('/dashboard')
  }
})
