<template>
  <div class="flex h-screen overflow-hidden">

    <!-- ─── Painel esquerdo — formulário ─── -->
    <div class="flex w-full md:w-[45%] flex-col justify-between bg-white px-10 py-8 md:px-14 md:py-10 overflow-hidden min-w-0">

      <!-- Logo -->
      <div class="flex items-center gap-2.5">
        <img src="/logotipocolor.svg" class="h-7 w-7" alt="Saquetti" />
        <span class="text-base font-semibold text-[#111827]">Saquetti</span>
      </div>

      <!-- Formulário central -->
      <div class="mx-auto w-full max-w-sm">

        <div class="mb-8">
          <h1 class="text-2xl font-bold text-[#111827]">Bem-vindo de volta</h1>
          <p class="mt-1.5 text-sm text-[#6b7280]">
            Digite seu e-mail e senha para acessar sua conta.
          </p>
        </div>

        <div
          v-if="mensagemLogout"
          class="mb-5 flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-left text-sm leading-relaxed text-green-800"
        >
          <svg class="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ mensagemLogout }}
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5" novalidate>

          <!-- E-mail -->
          <div class="space-y-1.5">
            <label for="email" class="block text-sm font-medium text-[#374151]">E-mail</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="seu@empresa.com.br"
              autocomplete="email"
              :class="[
                'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#111827]',
                'placeholder-[#9ca3af] shadow-sm outline-none transition',
                errors.email
                  ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-[#d1d5db] focus:border-[#155dfc] focus:ring-2 focus:ring-[#155dfc]/20'
              ]"
            />
            <p v-if="errors.email" class="text-xs text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Senha -->
          <div class="space-y-1.5">
            <label for="senha" class="block text-sm font-medium text-[#374151]">Senha</label>
            <div class="relative">
              <input
                id="senha"
                v-model="form.senha"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
                :class="[
                  'w-full rounded-lg border bg-white px-3.5 py-2.5 pr-11 text-sm text-[#111827]',
                  'placeholder-[#9ca3af] shadow-sm outline-none transition',
                  errors.senha
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-[#d1d5db] focus:border-[#155dfc] focus:ring-2 focus:ring-[#155dfc]/20'
                ]"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#374151] transition-colors"
                :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              >
                <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="errors.senha" class="text-xs text-red-600">{{ errors.senha }}</p>
          </div>

          <!-- Lembrar + Esqueceu -->
          <div class="flex items-center justify-between">
            <label class="flex cursor-pointer items-center gap-2">
              <input
                v-model="form.lembrar"
                type="checkbox"
                class="h-4 w-4 rounded border-[#d1d5db] accent-[#155dfc]"
              />
              <span class="text-sm text-[#374151]">Lembrar de mim</span>
            </label>
            <NuxtLink
              to="/recuperar-senha"
              class="text-sm font-medium text-[#155dfc] hover:text-[#1447e6] transition-colors"
            >
              Esqueceu sua senha?
            </NuxtLink>
          </div>

          <!-- Erro geral -->
          <div
            v-if="errorMessage"
            class="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-left text-sm leading-relaxed text-red-700"
          >
            <svg class="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ errorMessage }}
          </div>

          <!-- Botão entrar -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full rounded-lg bg-[#155dfc] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1447e6] focus:outline-none focus:ring-2 focus:ring-[#155dfc]/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Entrando...
            </span>
            <span v-else>Entrar</span>
          </button>

        </form>

      </div>

      <!-- Rodapé -->
      <p class="text-center text-xs text-[#9ca3af]">
        Copyright © 2025 Saquetti Enterprises LTD.
      </p>
    </div>

    <!-- ─── Painel direito — branding ─── -->
    <div
      class="hidden md:flex md:w-[55%] min-w-0 flex-col justify-center px-10 py-12 md:px-14 md:py-10 relative overflow-hidden"
      style="background: linear-gradient(145deg, #1d4ed8 0%, #155dfc 40%, #2d3aed 100%)"
    >
      <!-- Círculos decorativos -->
      <div class="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/5" />
      <div class="absolute top-1/3 right-10 h-40 w-40 rounded-full bg-white/5" />

      <!-- Texto principal -->
      <div class="relative z-10 max-w-xl pr-2">
        <h2 class="text-3xl font-bold leading-tight text-white">
          Gerencie sua equipe e<br />operações com facilidade.
        </h2>
        <p class="mt-3 text-base text-blue-200">
          Acesse o painel de gestão e acompanhe sua equipe em tempo real.
        </p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { mensagemErroParaUsuario } from '~/utils/apiErroUsuario'

definePageMeta({ layout: 'auth', middleware: 'guest' })

useHead({ title: 'Entrar' })

const { login } = useAuth()

const form = reactive({
  email: '',
  senha: '',
  lembrar: false,
})
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const errors = reactive({ email: '', senha: '' })


function validate() {
  errors.email = ''
  errors.senha = ''
  let valid = true

  if (!form.email) {
    errors.email = 'O e-mail é obrigatório.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Digite um e-mail válido.'
    valid = false
  }

  if (!form.senha) {
    errors.senha = 'A senha é obrigatória.'
    valid = false
  }

  return valid
}

const route = useRoute()
const router = useRouter()
const mensagemLogout = ref('')

if (route.query.saida === '1') {
  mensagemLogout.value = 'Você saiu da conta com sucesso.'
}

onMounted(() => {
  if (route.query.saida === '1') {
    router.replace({ path: '/login', query: {} })
  }
})

async function handleLogin() {
  errorMessage.value = ''
  mensagemLogout.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await login(form.email, form.senha, form.lembrar)
    await navigateTo('/dashboard')
  } catch (err: unknown) {
    errorMessage.value = mensagemErroParaUsuario(err, {
      contexto: 'login',
      fallback: 'Não foi possível entrar. Tente novamente.',
    })
  } finally {
    loading.value = false
  }
}
</script>
