export interface AuthUser {
  id: string
  nome: string
  email: string
  papel: 'admin' | 'gerente' | 'funcionario'
  empresa: string
  avatar?: string
}

/**
 * Quando `false`, não há bloqueio de rotas nem validação de senha: o app abre livremente
 * e o usuário da sidebar é preenchido em modo desenvolvimento.
 * Altere para `true` quando integrar com um backend real (API + cookie).
 */
export const AUTH_EXIGE_LOGIN = false

const USUARIO_MODO_LIVRE: AuthUser = {
  id: 'dev-local',
  nome: 'Modo desenvolvimento',
  email: 'dev@local',
  papel: 'admin',
  empresa: 'Saquetti',
}

export const useAuth = () => {
  const user = useState<AuthUser | null>('auth.user', () => null)
  const carregando = useState<boolean>('auth.carregando', () => false)

  const autenticado = computed(() => !!user.value)
  const ehAdmin = computed(() => user.value?.papel === 'admin')
  const ehGerente = computed(() => user.value?.papel === 'gerente' || user.value?.papel === 'admin')

  async function login(email: string, senha: string, lembrar = false) {
    if (!AUTH_EXIGE_LOGIN) {
      const e = email.trim()
      user.value = {
        ...USUARIO_MODO_LIVRE,
        email: e || USUARIO_MODO_LIVRE.email,
      }
      return
    }
    const data = await $fetch<{ user: AuthUser }>('/api/auth/login', {
      method: 'POST',
      body: { email, senha, lembrar },
    })
    user.value = data.user
  }

  async function logout() {
    if (AUTH_EXIGE_LOGIN) {
      await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    }
    user.value = null
  }

  async function buscarUsuario() {
    if (!AUTH_EXIGE_LOGIN) {
      user.value = USUARIO_MODO_LIVRE
      return
    }
    if (carregando.value) return
    carregando.value = true
    try {
      const data = await $fetch<{ user: AuthUser }>('/api/auth/me')
      user.value = data.user
    } catch {
      user.value = null
    } finally {
      carregando.value = false
    }
  }

  return {
    user: readonly(user),
    carregando: readonly(carregando),
    autenticado,
    ehAdmin,
    ehGerente,
    login,
    logout,
    buscarUsuario,
  }
}
