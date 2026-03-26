<template>
  <div class="flex min-h-screen items-center justify-center bg-[#f9fafb] p-6">
    <div class="w-full max-w-md">

      <!-- Voltar -->
      <NuxtLink
        to="/login"
        class="mb-6 inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-[#111827] transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar para o login
      </NuxtLink>

      <div class="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-[#e5e7eb]">

        <!-- ── Etapa 1: Solicitar reset ── -->
        <template v-if="etapa === 1">
          <div class="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
            <svg class="h-6 w-6 text-[#155dfc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
            </svg>
          </div>
          <h1 class="mt-4 text-xl font-bold text-[#111827]">Recuperar senha</h1>
          <p class="mt-1.5 text-sm text-[#6b7280]">
            Digite o e-mail cadastrado e enviaremos um link para redefinir sua senha.
          </p>

          <form @submit.prevent="handleSolicitarReset" class="mt-6 space-y-4" novalidate>
            <div class="space-y-1.5">
              <label for="email" class="block text-sm font-medium text-[#374151]">E-mail</label>
              <input
                id="email"
                v-model="email"
                type="email"
                placeholder="seu@empresa.com.br"
                autocomplete="email"
                :class="[
                  'w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-[#111827]',
                  'placeholder-[#9ca3af] shadow-sm outline-none transition',
                  erroEmail
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-[#d1d5db] focus:border-[#155dfc] focus:ring-2 focus:ring-[#155dfc]/20'
                ]"
              />
              <p v-if="erroEmail" class="text-xs text-red-600">{{ erroEmail }}</p>
            </div>

            <div
              v-if="erroGeral"
              class="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-left text-sm leading-relaxed text-red-800"
            >
              <svg class="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ erroGeral }}</span>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full rounded-lg bg-[#155dfc] py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1447e6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span v-if="loading" class="flex items-center justify-center gap-2">
                <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Enviando...
              </span>
              <span v-else>Enviar link de recuperação</span>
            </button>
          </form>
        </template>

        <!-- ── Etapa 2: E-mail enviado ── -->
        <template v-if="etapa === 2">
          <div class="py-4 text-center">
            <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <svg class="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h2 class="text-xl font-bold text-[#111827]">Verifique seu e-mail</h2>
            <p class="mt-2 text-sm text-[#6b7280]">
              Enviamos um link de recuperação para
              <span class="font-semibold text-[#374151]">{{ email }}</span>.
              Verifique sua caixa de entrada e a pasta de spam.
            </p>
            <p class="mt-4 text-xs text-[#9ca3af]">O link expira em 30 minutos.</p>

            <div
              v-if="erroGeral"
              class="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-left text-sm leading-relaxed text-red-800"
            >
              <svg class="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ erroGeral }}</span>
            </div>

            <div class="mt-6 space-y-3">
              <button
                type="button"
                @click="handleReenviar"
                :disabled="reenvioContador > 0"
                class="w-full rounded-lg border border-[#d1d5db] py-2.5 text-sm font-medium text-[#374151] shadow-sm transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {{ reenvioContador > 0 ? `Reenviar em ${reenvioContador}s` : 'Reenviar e-mail' }}
              </button>
              <NuxtLink
                to="/login"
                class="block w-full rounded-lg bg-[#155dfc] py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#1447e6]"
              >
                Voltar para o login
              </NuxtLink>
            </div>
          </div>
        </template>

      </div>

      <p class="mt-6 text-center text-xs text-[#9ca3af]">
        Copyright © 2025 Saquetti Enterprises LTD.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mensagemErroParaUsuario } from '~/utils/apiErroUsuario'

definePageMeta({ layout: 'auth', middleware: 'guest' })

useHead({ title: 'Recuperar Senha' })

const etapa = ref<1 | 2>(1)
const email = ref('')
const erroEmail = ref('')
const erroGeral = ref('')
const loading = ref(false)
const reenvioContador = ref(0)

let reenvioInterval: ReturnType<typeof setInterval> | null = null

function iniciarContadorReenvio() {
  reenvioContador.value = 60
  reenvioInterval = setInterval(() => {
    reenvioContador.value--
    if (reenvioContador.value <= 0 && reenvioInterval) {
      clearInterval(reenvioInterval)
    }
  }, 1000)
}

onUnmounted(() => {
  if (reenvioInterval) clearInterval(reenvioInterval)
})

async function handleSolicitarReset() {
  erroEmail.value = ''
  erroGeral.value = ''

  if (!email.value) {
    erroEmail.value = 'O e-mail é obrigatório.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    erroEmail.value = 'Digite um e-mail válido.'
    return
  }

  loading.value = true
  try {
    await $fetch('/api/auth/esqueci-senha', {
      method: 'POST',
      body: { email: email.value },
    })
    etapa.value = 2
    iniciarContadorReenvio()
  } catch (err: unknown) {
    erroGeral.value = mensagemErroParaUsuario(err, {
      contexto: 'recuperar-senha',
      fallback: 'Não foi possível enviar o e-mail. Tente novamente.',
    })
  } finally {
    loading.value = false
  }
}

async function handleReenviar() {
  if (reenvioContador.value > 0) return
  erroGeral.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/esqueci-senha', {
      method: 'POST',
      body: { email: email.value },
    })
    iniciarContadorReenvio()
  } catch (err: unknown) {
    erroGeral.value = mensagemErroParaUsuario(err, {
      contexto: 'recuperar-senha',
      fallback: 'Não foi possível reenviar. Tente novamente em instantes.',
    })
  } finally {
    loading.value = false
  }
}
</script>
