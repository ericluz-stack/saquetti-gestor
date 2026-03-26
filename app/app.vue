<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Tema global (classe `dark` no <html>) — registado uma vez para toda a app
registerAppColorModeHead()

// Inicializa o estado de autenticação uma única vez (SSR + cliente)
const { buscarUsuario } = useAuth()
await callOnce(buscarUsuario)
</script>
