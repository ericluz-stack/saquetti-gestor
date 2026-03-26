<script setup lang="ts">
// Entrada da app: sempre a tela de login (evita abrir o dashboard ao acessar localhost)
await navigateTo('/login', { replace: true })
</script>
