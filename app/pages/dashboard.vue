<template>
  <div class="p-5 lg:p-7 space-y-6">

    <!-- 1. Overlays (fechar dropdowns) -->
    <div v-if="exportDropdown !== null" class="fixed inset-0 z-10" @click="exportDropdown = null" />
    <div v-if="deptoGeralDropdown" class="fixed inset-0 z-10" @click="deptoGeralDropdown = false" />
    <div v-if="empresaGeralDropdown" class="fixed inset-0 z-10" @click="empresaGeralDropdown = false" />

    <!-- 2. Modal período personalizado -->
    <Teleport to="body">
      <div v-if="modalPeriodoAberto" class="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="modalPeriodoAberto = false">
        <div class="w-full max-w-sm rounded-2xl bg-white dark:bg-[#1e293b] p-6 shadow-2xl ring-1 ring-[#e5e7eb] dark:ring-[#334155]">
          <h3 class="mb-4 text-sm font-bold text-[#111827] dark:text-[#f1f5f9]">Período personalizado</h3>
          <div class="space-y-3">
            <div>
              <label class="block mb-1 text-xs font-medium text-[#374151] dark:text-[#cbd5e1]">Data início</label>
              <input
                v-model="periodoCustomInicio"
                type="date"
                class="w-full rounded-lg border border-[#d1d5db] dark:border-[#334155] bg-white dark:bg-[#0f172a] px-3 py-2 text-sm text-[#111827] dark:text-[#f1f5f9] outline-none focus:border-[#155dfc] focus:ring-2 focus:ring-[#155dfc]/20 transition"
              />
            </div>
            <div>
              <label class="block mb-1 text-xs font-medium text-[#374151] dark:text-[#cbd5e1]">Data fim</label>
              <input
                v-model="periodoCustomFim"
                type="date"
                class="w-full rounded-lg border border-[#d1d5db] dark:border-[#334155] bg-white dark:bg-[#0f172a] px-3 py-2 text-sm text-[#111827] dark:text-[#f1f5f9] outline-none focus:border-[#155dfc] focus:ring-2 focus:ring-[#155dfc]/20 transition"
              />
            </div>
          </div>
          <div class="mt-5 flex justify-end gap-2">
            <button
              @click="modalPeriodoAberto = false"
              class="rounded-lg border border-[#e5e7eb] dark:border-[#334155] px-4 py-2 text-xs font-medium text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155] transition"
            >Cancelar</button>
            <button
              @click="aplicarPeriodoCustom"
              :disabled="!periodoCustomInicio || !periodoCustomFim"
              class="rounded-lg bg-[#155dfc] dark:bg-blue-700 px-4 py-2 text-xs font-medium text-white hover:bg-[#1248c7] dark:hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >Aplicar</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- 3. Block A — Cartões Ponto Pendentes (condicional) — destaque no topo, sem sombra -->
    <div
      v-if="cartoesPendentes.total > 0 && mostrarAlertaCartoesPendentes"
      class="flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 border-l-[6px] border-l-[#155dfc] sm:flex-row sm:items-start dark:border-blue-800 dark:bg-blue-950/35 dark:border-l-[#60a5fa]"
    >
      <div class="hidden sm:flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40">
        <svg class="h-5 w-5 text-[#155dfc] dark:text-[#60a5fa]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="h-2 w-2 flex-shrink-0 rounded-full bg-[#155dfc] dark:bg-[#60a5fa]" />
          <h3 class="text-sm font-bold text-blue-950 dark:text-blue-100">Cartões ponto pendentes de assinatura</h3>
          <span class="rounded-full bg-blue-200/80 px-2 py-0.5 text-[11px] font-bold text-blue-900 dark:bg-blue-800/60 dark:text-blue-100">
            {{ cartoesPendentes.total }} aguardando
          </span>
        </div>
        <p class="mt-1.5 text-[11px] leading-snug text-blue-800/90 dark:text-blue-200/85">
          A assinatura é feita pelo colaborador; aqui você acompanha o que falta.
        </p>
        <ul class="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
          <li
            v-for="(nome, idx) in cartoesPendentes.colaboradores.slice(0, 3)"
            :key="idx"
            class="text-xs text-blue-900 dark:text-blue-200"
          >· {{ nome }}</li>
        </ul>
        <p class="mt-1 text-[10px] text-blue-600/80 dark:text-blue-300/80">Período de referência: {{ currentMonthLabel }}</p>
      </div>
      <div class="flex shrink-0 flex-row sm:flex-col items-stretch gap-2 self-stretch sm:self-start sm:items-end">
        <NuxtLink
          to="/cartao-ponto"
          class="rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-center text-xs font-semibold text-[#155dfc] transition-colors hover:bg-blue-50 dark:border-blue-600 dark:bg-[#1e293b] dark:text-[#60a5fa] dark:hover:bg-blue-950/50"
        >
          Ver cartões ponto
        </NuxtLink>
        <button
          type="button"
          class="rounded-lg px-2 py-1 text-[11px] font-medium text-blue-700/80 hover:bg-blue-100/70 dark:text-blue-300/90 dark:hover:bg-blue-900/40"
          @click="dispensarAlertaCartoesPendentes"
        >
          Fechar aviso
        </button>
      </div>
    </div>

    <!-- 4. Block B — Barra de filtros unificada -->
    <div class="flex flex-wrap items-center gap-2 rounded-2xl bg-white dark:bg-[#1e293b] px-3 py-2.5 sm:px-4 sm:py-3 shadow-sm ring-1 ring-[#e5e7eb] dark:ring-[#334155]">
      <!-- Dropdown Empresa -->
      <div class="relative">
        <button
          @click.stop="empresaGeralDropdown = !empresaGeralDropdown"
          :class="[
            'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-sm transition',
            empresaGeral !== 'Todas'
              ? 'border-[#155dfc] bg-[#eff6ff] dark:bg-[#1e3a5f] text-[#155dfc] dark:text-[#60a5fa] dark:border-[#60a5fa]'
              : 'border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155]',
          ]"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {{ empresaGeral === 'Todas' ? 'Empresa' : empresaGeral }}
          <svg class="h-3 w-3" :class="empresaGeralDropdown ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="transition: transform 0.15s">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          v-if="empresaGeralDropdown"
          class="absolute left-0 top-full z-30 mt-1 w-44 rounded-xl border border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] py-1.5 shadow-lg"
        >
          <button
            v-for="emp in empresas"
            :key="emp"
            @click="empresaGeral = emp; empresaGeralDropdown = false"
            :class="[
              'flex w-full items-center justify-between px-3 py-1.5 text-xs transition-colors hover:bg-[#f9fafb] dark:hover:bg-[#334155]',
              empresaGeral === emp ? 'text-[#155dfc] dark:text-[#60a5fa] font-semibold' : 'text-[#374151] dark:text-[#cbd5e1]',
            ]"
          >
            {{ emp }}
            <svg v-if="empresaGeral === emp" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Pills de período -->
      <div class="flex items-center overflow-x-auto rounded-lg border border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] shadow-sm">
        <button
          v-for="p in periodos"
          :key="p"
          @click="p === 'personalizado' ? (modalPeriodoAberto = true) : (periodoAtivo = p)"
          :class="[
            'px-3 py-1.5 text-xs font-medium transition-colors border-r border-[#e5e7eb] dark:border-[#334155] last:border-r-0',
            periodoAtivo === p
              ? 'bg-[#155dfc] dark:bg-blue-700 text-white'
              : 'text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155]',
          ]"
        >{{ periodoLabels[p] }}</button>
      </div>
      <!-- Dropdown Departamento -->
      <div class="relative">
        <button
          @click.stop="deptoGeralDropdown = !deptoGeralDropdown"
          :class="[
            'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-sm transition',
            deptoGeral !== 'Todos'
              ? 'border-[#155dfc] bg-[#eff6ff] dark:bg-[#1e3a5f] text-[#155dfc] dark:text-[#60a5fa] dark:border-[#60a5fa]'
              : 'border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155]',
          ]"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {{ deptoGeral === 'Todos' ? 'Departamento' : deptoGeral }}
          <svg class="h-3 w-3" :class="deptoGeralDropdown ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" style="transition: transform 0.15s">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div
          v-if="deptoGeralDropdown"
          class="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] py-1.5 shadow-lg"
        >
          <button
            v-for="dep in departamentos"
            :key="dep"
            @click="deptoGeral = dep; deptoGeralDropdown = false"
            :class="[
              'flex w-full items-center justify-between px-3 py-1.5 text-xs transition-colors hover:bg-[#f9fafb] dark:hover:bg-[#334155]',
              deptoGeral === dep ? 'text-[#155dfc] dark:text-[#60a5fa] font-semibold' : 'text-[#374151] dark:text-[#cbd5e1]',
            ]"
          >
            {{ dep }}
            <svg v-if="deptoGeral === dep" class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Exportar -->
      <div class="relative w-full sm:w-auto sm:ml-auto">
        <button
          @click.stop="exportDropdown = exportDropdown === 'visao_geral' ? null : 'visao_geral'"
          class="flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] px-3 py-1.5 text-xs font-medium text-[#374151] dark:text-[#cbd5e1] shadow-sm transition hover:bg-[#f9fafb] dark:hover:bg-[#334155]"
        >
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar
        </button>
        <div
          v-if="exportDropdown === 'visao_geral'"
          class="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] py-1.5 shadow-lg"
        >
          <button
            v-for="op in opcoesExport"
            :key="op.key"
            @click="exportDropdown = null"
            class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155] transition-colors"
          >
            <span v-html="op.icone" class="[&>svg]:h-3.5 [&>svg]:w-3.5 text-[#6b7280] dark:text-[#94a3b8]" />
            {{ op.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 5. Block D — Acesso Rápido -->
    <div>
      <h2 class="mb-3 text-base font-bold text-[#111827] dark:text-[#f1f5f9]">Acesso Rápido</h2>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <NuxtLink
          v-for="a in atalhos"
          :key="a.to"
          :to="a.to"
          class="group relative flex flex-col gap-2 sm:gap-2.5 rounded-2xl bg-white dark:bg-[#1e293b] p-3 sm:p-4 shadow-sm ring-1 ring-[#e5e7eb] dark:ring-[#334155] transition-all hover:shadow-md hover:ring-[#155dfc]/40 dark:hover:ring-[#60a5fa]/40"
        >
          <div :class="['flex h-9 w-9 items-center justify-center rounded-xl [&>svg]:h-5 [&>svg]:w-5', a.iconeBg, a.iconeColor]" v-html="a.icone" />
          <div>
            <p class="text-sm font-semibold text-[#111827] dark:text-[#f1f5f9]">{{ a.label }}</p>
            <p class="mt-0.5 text-[11px] text-[#9ca3af] dark:text-[#64748b] leading-snug">{{ a.descricao }}</p>
          </div>
          <span
            v-if="a.badge"
            class="absolute right-3 top-3 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#155dfc] dark:bg-blue-700 px-1.5 text-[10px] font-bold text-white"
          >{{ a.badge }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- 6. Block C — Visão Geral (cards agrupados) -->
    <div>
      <h2 class="mb-4 text-base font-bold text-[#111827] dark:text-[#f1f5f9]">Visão Geral</h2>

      <!-- Cards de métricas -->
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="card in cardsMetrica"
          :key="card.titulo"
          class="rounded-2xl bg-white dark:bg-[#1e293b] p-3.5 sm:p-5 shadow-sm ring-1 ring-[#e5e7eb] dark:ring-[#334155] transition hover:shadow-md"
        >
          <div class="mb-3">
            <div :class="['flex h-9 w-9 items-center justify-center rounded-xl', card.iconeBg]" v-html="card.icone" />
          </div>
          <p class="text-xs font-medium text-[#6b7280] dark:text-[#94a3b8]">{{ card.titulo }}</p>
          <p class="mt-1 text-2xl font-bold text-[#111827] dark:text-[#f1f5f9]">{{ card.valor }}</p>
          <p class="mt-1.5 text-xs leading-snug text-[#9ca3af] dark:text-[#64748b]">
            <span
              :class="[
                card.variacao === 0 ? 'font-normal' : 'font-medium',
                card.variacao > 0 ? 'text-green-600 dark:text-green-400' : '',
                card.variacao < 0 ? 'text-red-500 dark:text-red-400' : '',
              ]"
            >
              <template v-if="card.variacao === 0">Sem variação</template>
              <template v-else>{{ card.variacao > 0 ? '+' : '' }}{{ card.variacao }}%</template>
            </span>
            <span> · {{ periodoVariacaoLegenda }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 7. Block E — Tabela de registros + painel de alertas -->
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">

      <!-- Tabela de Registros do Dia -->
      <div class="lg:col-span-2 rounded-2xl bg-white dark:bg-[#1e293b] shadow-sm ring-1 ring-[#e5e7eb] dark:ring-[#334155]">

        <div class="flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-b border-[#f3f4f6] dark:border-[#334155] px-3.5 py-3 sm:px-5 sm:py-4">
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-[#111827] dark:text-[#f1f5f9] truncate">Registros de Ponto — Hoje</h3>
            <p class="mt-0.5 text-xs text-[#9ca3af] dark:text-[#64748b] truncate">Atualizados em tempo real · {{ new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink to="/registros" class="flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] dark:border-[#334155] px-3 py-1.5 text-xs font-medium text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155] transition-colors">
              Ver todos
              <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </NuxtLink>
            <div class="relative">
              <button
                @click.stop="exportDropdown = exportDropdown === 'registros' ? null : 'registros'"
                class="flex items-center gap-1.5 rounded-lg border border-[#e5e7eb] dark:border-[#334155] px-3 py-1.5 text-xs font-medium text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155] transition-colors"
              >
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exportar
              </button>
              <div
                v-if="exportDropdown === 'registros'"
                class="absolute right-0 top-full mt-1 z-30 w-44 rounded-xl border border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] py-1.5 shadow-lg"
              >
                <button
                  v-for="op in opcoesExport"
                  :key="op.key"
                  @click="exportDropdown = null"
                  class="flex w-full items-center gap-2.5 px-3 py-2 text-xs text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155] transition-colors"
                >
                  <span v-html="op.icone" class="[&>svg]:h-3.5 [&>svg]:w-3.5 text-[#6b7280] dark:text-[#94a3b8]" />
                  {{ op.label }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex overflow-x-auto border-b border-[#f3f4f6] dark:border-[#334155] px-5">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="tabAtiva = tab.key"
            :class="[
              'relative flex-shrink-0 px-3 py-3 text-xs font-medium transition-colors',
              tabAtiva === tab.key
                ? 'text-[#155dfc] dark:text-[#60a5fa] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#155dfc] dark:after:bg-[#60a5fa]'
                : 'text-[#6b7280] dark:text-[#94a3b8] hover:text-[#374151] dark:hover:text-[#cbd5e1]',
            ]"
          >
            {{ tab.label }}
            <span
              v-if="tab.count !== null"
              :class="[
                'ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold',
                tab.urgente
                  ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  : tabAtiva === tab.key
                    ? 'bg-[#eff6ff] dark:bg-[#1e3a5f] text-[#155dfc] dark:text-[#60a5fa]'
                    : 'bg-[#f3f4f6] dark:bg-[#334155] text-[#6b7280] dark:text-[#94a3b8]',
              ]"
            >{{ tab.count }}</span>
          </button>
        </div>

        <!-- Tabela -->
        <div class="overflow-x-auto">
          <table class="w-full min-w-[640px]">
            <thead>
              <tr class="border-b border-[#f3f4f6] dark:border-[#334155] bg-[#fafafa] dark:bg-[#0f172a]">
                <th class="px-5 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] dark:text-[#64748b]">Funcionário</th>
                <th class="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] dark:text-[#64748b]">Tipo</th>
                <th class="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] dark:text-[#64748b]">Horário</th>
                <th class="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] dark:text-[#64748b]">Ocorrência</th>
                <th class="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] dark:text-[#64748b]">Situação</th>
                <th class="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] dark:text-[#64748b]">Depto.</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#f9fafb] dark:divide-[#334155]">
              <tr
                v-for="reg in registrosFiltrados"
                :key="reg.id"
                class="transition-colors hover:bg-[#fafafa] dark:hover:bg-[#0f172a]"
              >
                <td class="px-5 py-3">
                  <div class="flex items-center gap-2.5">
                    <div :class="['flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white', reg.avatarBg]">
                      {{ reg.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('') }}
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-xs font-semibold text-[#111827] dark:text-[#f1f5f9]">{{ reg.nome }}</p>
                      <p class="truncate text-[10px] text-[#9ca3af] dark:text-[#64748b]">{{ reg.cargo }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3">
                  <span :class="['inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-semibold', tipoClasse(reg.tipo)]">
                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path v-if="reg.tipo === 'Entrada'" stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      <path v-else-if="reg.tipo === 'Saída'" stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636" />
                    </svg>
                    {{ reg.tipo }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <p class="text-xs font-semibold text-[#111827] dark:text-[#f1f5f9]">{{ reg.horaRegistrada }}</p>
                  <p class="text-[10px] text-[#9ca3af] dark:text-[#64748b]">esperado {{ reg.horaEsperada }}</p>
                </td>
                <td class="px-4 py-3">
                  <span v-if="reg.situacao === 'No horário'" class="text-xs font-medium text-green-600 dark:text-green-400">No horário</span>
                  <span v-else-if="reg.situacao === 'Atrasado'" class="text-xs font-medium text-orange-500 dark:text-orange-400">
                    Atraso <span class="font-normal opacity-80">{{ reg.desvio }}</span>
                  </span>
                  <span v-else-if="reg.situacao === 'Hora Extra'" class="text-xs font-medium text-blue-600 dark:text-blue-400">
                    Hora extra <span class="font-normal opacity-80">{{ reg.desvio }}</span>
                  </span>
                  <span v-else-if="reg.tipo === 'Ausente'" class="text-xs font-medium text-red-500 dark:text-red-400">Ausente</span>
                  <span v-else class="text-xs font-medium text-[#9ca3af]">—</span>
                </td>
                <td class="px-4 py-3">
                  <span :class="['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold', situacaoClasse(reg.situacao)]">
                    <span class="h-1.5 w-1.5 rounded-full bg-current" />
                    {{ reg.situacao }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs text-[#6b7280] dark:text-[#94a3b8]">{{ reg.departamento }}</td>
              </tr>
              <tr v-if="registrosFiltrados.length === 0">
                <td colspan="6" class="px-5 py-10 text-center text-sm text-[#9ca3af] dark:text-[#64748b]">
                  Nenhum registro encontrado nesta categoria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between border-t border-[#f3f4f6] dark:border-[#334155] px-5 py-3">
          <p class="text-xs text-[#9ca3af] dark:text-[#64748b]">
            <span class="font-semibold text-[#374151] dark:text-[#cbd5e1]">{{ registrosFiltrados.length }}</span> registros
            · <span class="font-semibold text-orange-500">{{ registros.filter(r => r.situacao === 'Atrasado').length }} atrasados</span>
            · <span class="font-semibold text-red-500">{{ registros.filter(r => r.situacao === 'Ausente').length }} ausências</span>
          </p>
          <NuxtLink to="/registros" class="text-xs font-medium text-[#155dfc] dark:text-[#60a5fa] hover:underline">
            Ver espelho completo →
          </NuxtLink>
        </div>
      </div>

      <!-- Painel Lateral: Alertas e Inconsistências -->
      <div class="lg:col-span-1 flex flex-col gap-4">
        <div class="rounded-2xl bg-white dark:bg-[#1e293b] shadow-sm ring-1 ring-[#e5e7eb] dark:ring-[#334155]">
          <div class="flex items-center justify-between border-b border-[#f3f4f6] dark:border-[#334155] bg-red-50 dark:bg-red-900/10 px-4 py-3 rounded-t-2xl">
            <div class="flex items-center gap-2">
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg class="h-3 w-3 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </span>
              <h4 class="text-sm font-bold text-[#111827] dark:text-[#f1f5f9]">Alertas e Inconsistências</h4>
            </div>
            <span class="rounded-full bg-red-100 dark:bg-red-900/30 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:text-red-400">
              {{ inconsistenciasFiltradas.length }}
            </span>
          </div>

          <div class="flex items-center gap-1 border-b border-[#f3f4f6] dark:border-[#334155] px-4 py-2 overflow-x-auto">
            <button
              v-for="f in filtrosInconsistencia"
              :key="f.key"
              @click="inconsistenciasFiltro = f.key"
              :class="[
                'flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors',
                inconsistenciasFiltro === f.key
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'text-[#6b7280] dark:text-[#94a3b8] hover:bg-[#f3f4f6] dark:hover:bg-[#334155]',
              ]"
            >{{ f.label }}</button>
          </div>

          <ul class="divide-y divide-[#f9fafb] dark:divide-[#334155]">
            <li
              v-for="item in inconsistenciasFiltradas"
              :key="item.id"
              class="flex items-start gap-3 px-4 py-3 hover:bg-[#fafafa] dark:hover:bg-[#0f172a] transition-colors"
            >
              <div :class="['flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white', item.avatarBg]">
                {{ item.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('') }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5">
                  <p class="truncate text-xs font-semibold text-[#111827] dark:text-[#f1f5f9]">{{ item.nome }}</p>
                  <span :class="['flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold', tipoInconsistenciaClasse(item.tipo)]">
                    {{ filtrosInconsistencia.find(f => f.key === item.tipo)?.label }}
                  </span>
                </div>
                <p
                  :class="[
                    'mt-0.5 text-[10px] leading-snug',
                    item.tipo === 'hora_extra'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-red-500 dark:text-red-400',
                  ]"
                >{{ item.problema }}</p>
              </div>
            </li>
          </ul>
          <div class="border-t border-[#f3f4f6] dark:border-[#334155] px-4 py-2.5">
            <NuxtLink to="/registros" class="text-xs font-medium text-[#155dfc] dark:text-[#60a5fa] hover:underline">
              Ver todas as inconsistências →
            </NuxtLink>
          </div>
        </div>

        <div class="rounded-2xl bg-white dark:bg-[#1e293b] shadow-sm ring-1 ring-[#e5e7eb] dark:ring-[#334155]">
          <div class="flex items-center justify-between border-b border-[#f3f4f6] dark:border-[#334155] bg-violet-50 dark:bg-violet-900/10 px-4 py-3 rounded-t-2xl">
            <div class="flex items-center gap-2">
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/30">
                <svg class="h-3 w-3 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-6-10a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </span>
              <div>
                <h4 class="text-sm font-bold text-[#111827] dark:text-[#f1f5f9]">Aniversariantes</h4>
                <p class="text-[10px] font-normal text-violet-700/80 dark:text-violet-300/80">{{ currentMonthLabel }}</p>
              </div>
            </div>
            <span class="rounded-full bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:text-violet-300">
              {{ aniversariantesDoMesCorrente.length }}
            </span>
          </div>

          <ul class="divide-y divide-[#f9fafb] dark:divide-[#334155]">
            <li
              v-for="p in aniversariantesDoMesCorrente"
              :key="'aniv-' + p.id"
              class="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#fafafa] dark:hover:bg-[#0f172a]"
            >
              <div :class="['flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white', p.avatarBg]">
                {{ p.nome.split(' ').map((n: string) => n[0]).slice(0, 2).join('') }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-1.5">
                  <p class="truncate text-xs font-semibold text-[#111827] dark:text-[#f1f5f9]">{{ p.nome }}</p>
                  <span
                    v-if="aniversarianteEhHoje(p)"
                    class="flex-shrink-0 rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-semibold text-violet-700 dark:bg-violet-900/35 dark:text-violet-300"
                  >Hoje</span>
                  <span
                    v-else
                    class="flex-shrink-0 rounded-full bg-[#f3f4f6] px-1.5 py-0.5 text-[9px] font-semibold text-[#6b7280] dark:bg-[#334155] dark:text-[#94a3b8]"
                  >{{ formatarDiaMes(p.dia, p.mes) }}</span>
                </div>
                <p class="mt-0.5 text-[10px] leading-snug text-[#6b7280] dark:text-[#94a3b8]">{{ p.cargo }}</p>
              </div>
            </li>
          </ul>
          <div class="border-t border-[#f3f4f6] dark:border-[#334155] px-4 py-2.5">
            <NuxtLink to="/funcionarios" class="text-xs font-medium text-[#155dfc] dark:text-[#60a5fa] hover:underline">
              Ver equipe →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Dashboard' })

// ─── Filtro global de período ─────────────────────────────────────────────────
type Periodo = 'hoje' | 'semana' | 'mes' | 'personalizado'
const periodoAtivo = ref<Periodo>('hoje')
const periodos: Periodo[] = ['hoje', 'semana', 'mes', 'personalizado']
const periodoLabels: Record<Periodo, string> = {
  hoje: 'Hoje',
  semana: 'Semana',
  mes: 'Mês',
  personalizado: 'Personalizado',
}

const modalPeriodoAberto = ref(false)
const periodoCustomInicio = ref('')
const periodoCustomFim = ref('')

function aplicarPeriodoCustom() {
  if (!periodoCustomInicio.value || !periodoCustomFim.value) return
  periodoAtivo.value = 'personalizado'
  modalPeriodoAberto.value = false
}

/** Texto do eixo de comparação da variação % (evita confundir com a data do filtro, ex. “vs 26 de mar.”) */
const periodoVariacaoLegenda = computed(() => {
  const p = periodoAtivo.value
  if (p === 'hoje') return 'em relação a ontem'
  if (p === 'semana') return 'em relação à semana anterior'
  if (p === 'mes') return 'em relação ao mês anterior'
  if (p === 'personalizado') return 'em relação ao período equivalente anterior'
  return 'em relação ao período anterior'
})

const currentMonthLabel = computed(() =>
  new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
)

// ─── Filtro de empresa ────────────────────────────────────────────────────────
const empresaGeral = ref('Todas')
const empresaGeralDropdown = ref(false)
const empresas = ['Todas', 'Saquetti', 'Matriz SP', 'Filial RJ']

// ─── Filtro de departamento ───────────────────────────────────────────────────
const deptoGeral = ref('Todos')
const deptoGeralDropdown = ref(false)
const departamentos = ['Todos', 'RH', 'TI', 'Financeiro', 'Comercial']

// ─── Exportar ─────────────────────────────────────────────────────────────────
type ExportContexto = 'visao_geral' | 'registros'
const exportDropdown = ref<ExportContexto | null>(null)
const opcoesExport = [
  {
    key: 'csv',
    label: 'Exportar CSV',
    icone: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
  },
  {
    key: 'excel',
    label: 'Exportar Excel',
    icone: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>`,
  },
  {
    key: 'pdf',
    label: 'Exportar PDF',
    icone: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`,
  },
]

// ─── Cartões Ponto Pendentes ──────────────────────────────────────────────────
const cartoesPendentes = ref({
  total: 3,
  colaboradores: ['Jerome Bell', 'Esther Howard', 'Cameron Williamson'],
})

const CARTOES_PENDENTES_BANNER_SESSION_KEY = 'dashboard.cartoesPendentes.banner.dismissed'

const mostrarAlertaCartoesPendentes = ref(true)

onMounted(() => {
  if (import.meta.client && sessionStorage.getItem(CARTOES_PENDENTES_BANNER_SESSION_KEY) === '1')
    mostrarAlertaCartoesPendentes.value = false
})

function dispensarAlertaCartoesPendentes() {
  mostrarAlertaCartoesPendentes.value = false
  if (import.meta.client)
    sessionStorage.setItem(CARTOES_PENDENTES_BANNER_SESSION_KEY, '1')
}

// ─── Aniversariantes (mês corrente — demo) ────────────────────────────────────
type Aniversariante = {
  id: number
  nome: string
  cargo: string
  mes: number
  dia: number
  avatarBg: string
}

const aniversariantesDoMesCorrente = computed((): Aniversariante[] => {
  const agora = new Date()
  const y = agora.getFullYear()
  const mh = agora.getMonth()
  const m = mh + 1
  const d = agora.getDate()
  const ultimo = new Date(y, mh + 1, 0).getDate()
  return [
    { id: 1, nome: 'Rafael Mendes', cargo: 'Desenvolvedor', mes: m, dia: d, avatarBg: 'bg-emerald-500' },
    { id: 2, nome: 'Patrícia Lima', cargo: 'Analista Financeiro', mes: m, dia: Math.min(d + 5, ultimo), avatarBg: 'bg-rose-500' },
    { id: 3, nome: 'Marcos Vieira', cargo: 'Comercial', mes: m, dia: Math.max(1, d - 6), avatarBg: 'bg-violet-500' },
    { id: 4, nome: 'Juliana Rocha', cargo: 'RH', mes: m, dia: Math.min(18, ultimo), avatarBg: 'bg-amber-500' },
  ].sort((a, b) => a.dia - b.dia)
})

function formatarDiaMes(dia: number, mes: number) {
  return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}`
}

function aniversarianteEhHoje(p: Aniversariante) {
  const x = new Date()
  return p.mes === x.getMonth() + 1 && p.dia === x.getDate()
}

// ─── Atalhos rápidos ──────────────────────────────────────────────────────────
const atalhos = [
  {
    label: 'Funcionários',
    descricao: 'Gerenciar equipe',
    to: '/funcionarios',
    iconeBg: 'bg-blue-50 dark:bg-blue-900/20',
    iconeColor: 'text-[#155dfc]',
    badge: null,
    icone: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  },
  {
    label: 'Gestão de Marcações',
    descricao: 'Registros do dia',
    to: '/registros',
    iconeBg: 'bg-violet-50 dark:bg-violet-900/20',
    iconeColor: 'text-violet-600',
    badge: null,
    icone: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`,
  },
  {
    label: 'Cartão Ponto',
    descricao: 'Espelhos e assinaturas',
    to: '/cartao-ponto',
    iconeBg: 'bg-orange-50 dark:bg-orange-900/20',
    iconeColor: 'text-orange-600',
    badge: null,
    icone: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>`,
  },
  {
    label: 'Relatórios',
    descricao: 'Espelhos e exportações',
    to: '/relatorios',
    iconeBg: 'bg-teal-50 dark:bg-teal-900/20',
    iconeColor: 'text-teal-600',
    badge: null,
    icone: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
  },
  {
    label: 'Solicitações',
    descricao: 'Pendentes de aprovação',
    to: '/solicitacoes',
    iconeBg: 'bg-amber-50 dark:bg-amber-900/20',
    iconeColor: 'text-amber-600',
    badge: cartoesPendentes.value.total || null,
    icone: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>`,
  },
]

// ─── Cards de métricas ────────────────────────────────────────────────────────
const cardsMetrica = [
  {
    titulo: 'Funcionários Ativos',
    valor: '248',
    variacao: 12,
    iconeBg: 'bg-blue-50 dark:bg-blue-900/20',
    icone: `<svg class="h-5 w-5 text-[#155dfc]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
  },
  {
    titulo: 'Trabalhando Hoje',
    valor: '201',
    variacao: 5,
    iconeBg: 'bg-green-50 dark:bg-green-900/20',
    icone: `<svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  },
  {
    titulo: 'Em Atraso',
    valor: '7',
    variacao: -30,
    iconeBg: 'bg-orange-50 dark:bg-orange-900/20',
    icone: `<svg class="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  },
  {
    titulo: 'Ausentes',
    valor: '12',
    variacao: -50,
    iconeBg: 'bg-red-50 dark:bg-red-900/20',
    icone: `<svg class="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/></svg>`,
  },
  {
    titulo: 'Em Férias',
    valor: '18',
    variacao: 0,
    iconeBg: 'bg-violet-50 dark:bg-violet-900/20',
    icone: `<svg class="h-5 w-5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
  },
  {
    titulo: 'Afastados',
    valor: '9',
    variacao: 0,
    iconeBg: 'bg-slate-100 dark:bg-slate-800/40',
    icone: `<svg class="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
  },
  {
    titulo: 'Solicitações Pendentes',
    valor: '3',
    variacao: 0,
    iconeBg: 'bg-amber-50 dark:bg-amber-900/20',
    icone: `<svg class="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/></svg>`,
  },
]

// ─── Registros de ponto ───────────────────────────────────────────────────────
const avatarBgs = ['bg-[#155dfc]', 'bg-violet-500', 'bg-orange-500', 'bg-green-600', 'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500']

const registros = [
  { id: 1, nome: 'Savannah Nguyen',    cargo: 'Gerente de RH',        departamento: 'Recursos Humanos', tipo: 'Entrada', horaRegistrada: '07:58', horaEsperada: '08:00', desvio: '2min antes',  situacao: 'No horário', tab: 'entradas',  avatarBg: avatarBgs[0] },
  { id: 2, nome: 'Jerome Bell',        cargo: 'Desenvolvedor Sr.',    departamento: 'Tecnologia',       tipo: 'Entrada', horaRegistrada: '08:34', horaEsperada: '08:00', desvio: '+34min',      situacao: 'Atrasado',   tab: 'atrasados', avatarBg: avatarBgs[1] },
  { id: 3, nome: 'Darlene Robertson',  cargo: 'Analista Financeiro',  departamento: 'Financeiro',       tipo: 'Entrada', horaRegistrada: '08:02', horaEsperada: '08:00', desvio: '2min depois', situacao: 'No horário', tab: 'entradas',  avatarBg: avatarBgs[2] },
  { id: 4, nome: 'Cody Fisher',        cargo: 'Designer',             departamento: 'Marketing',        tipo: 'Saída',   horaRegistrada: '17:48', horaEsperada: '18:00', desvio: '-12min',      situacao: 'No horário', tab: 'saidas',    avatarBg: avatarBgs[3] },
  { id: 5, nome: 'Esther Howard',      cargo: 'Executiva de Vendas',  departamento: 'Comercial',        tipo: 'Saída',   horaRegistrada: '19:22', horaEsperada: '18:00', desvio: '+1h22',       situacao: 'Hora Extra',  tab: 'saidas',    avatarBg: avatarBgs[4] },
  { id: 6, nome: 'Brooklyn Simmons',   cargo: 'Analista de Suporte',  departamento: 'Atendimento',      tipo: 'Ausente', horaRegistrada: '—',     horaEsperada: '08:00', desvio: '—',           situacao: 'Ausente',    tab: 'ausencias', avatarBg: avatarBgs[5] },
  { id: 7, nome: 'Cameron Williamson', cargo: 'Coord. de Logística',  departamento: 'Operações',        tipo: 'Entrada', horaRegistrada: '08:11', horaEsperada: '08:00', desvio: '+11min',      situacao: 'Atrasado',   tab: 'atrasados', avatarBg: avatarBgs[6] },
  { id: 8, nome: 'Lucas Ferreira',     cargo: 'Assistente Comercial', departamento: 'Comercial',        tipo: 'Ausente', horaRegistrada: '—',     horaEsperada: '08:00', desvio: '—',           situacao: 'Ausente',    tab: 'ausencias', avatarBg: avatarBgs[7] },
]

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const tabAtiva = ref('todos')

const tabs = computed(() => [
  { key: 'todos',     label: 'Todos',     count: registros.length,                                    urgente: false },
  { key: 'entradas',  label: 'Entradas',  count: registros.filter(r => r.tab === 'entradas').length,  urgente: false },
  { key: 'saidas',    label: 'Saídas',    count: registros.filter(r => r.tab === 'saidas').length,    urgente: false },
  { key: 'atrasados', label: 'Atrasados', count: registros.filter(r => r.tab === 'atrasados').length, urgente: true  },
  { key: 'ausencias', label: 'Ausências', count: registros.filter(r => r.tab === 'ausencias').length, urgente: true  },
])

const registrosFiltrados = computed(() =>
  tabAtiva.value === 'todos' ? registros : registros.filter(r => r.tab === tabAtiva.value)
)

// ─── Inconsistências ──────────────────────────────────────────────────────────
type TipoInconsistencia = 'todos' | 'falta_marcacao' | 'atraso' | 'invalido' | 'jornada' | 'hora_extra'
type TipoInconsistenciaItem = Exclude<TipoInconsistencia, 'todos'>

const inconsistenciasFiltro = ref<TipoInconsistencia>('todos')

const inconsistenciasFixas: {
  id: number
  nome: string
  cargo: string
  problema: string
  tipo: TipoInconsistenciaItem
  avatarBg: string
}[] = [
  { id: 1, nome: 'Jerome Bell',        cargo: 'Desenvolvedor Sr.',    problema: 'Sem marcação de saída ontem',     tipo: 'falta_marcacao', avatarBg: 'bg-violet-500' },
  { id: 2, nome: 'Brooklyn Simmons',   cargo: 'Analista de Suporte',  problema: 'Ausência não justificada',        tipo: 'atraso',          avatarBg: 'bg-teal-500'   },
  { id: 3, nome: 'Lucas Ferreira',     cargo: 'Assistente Comercial', problema: 'Entrada duplicada 08:02 / 08:05', tipo: 'invalido',        avatarBg: 'bg-red-500'    },
  { id: 4, nome: 'Esther Howard',      cargo: 'Executiva de Vendas',  problema: 'Sem marcação de saída em 22/03',  tipo: 'falta_marcacao', avatarBg: 'bg-pink-500'   },
  { id: 5, nome: 'Cameron Williamson', cargo: 'Coord. de Logística',  problema: 'Inter-jornada inferior a 11h',    tipo: 'jornada',         avatarBg: 'bg-indigo-500' },
]

const inconsistenciasDasMarcacoes = computed(() =>
  registros
    .filter(r => r.situacao === 'Hora Extra')
    .map(r => ({
      id: 1000 + r.id,
      nome: r.nome,
      cargo: r.cargo,
      problema: `Saída após o horário esperado (${r.horaEsperada} → ${r.horaRegistrada}, ${r.desvio})`,
      tipo: 'hora_extra' as const,
      avatarBg: r.avatarBg,
    })),
)

const inconsistenciasTodas = computed(() => [
  ...inconsistenciasFixas,
  ...inconsistenciasDasMarcacoes.value,
])

const inconsistenciasFiltradas = computed(() =>
  inconsistenciasFiltro.value === 'todos'
    ? inconsistenciasTodas.value
    : inconsistenciasTodas.value.filter(i => i.tipo === inconsistenciasFiltro.value),
)

const filtrosInconsistencia: { key: TipoInconsistencia; label: string }[] = [
  { key: 'todos',          label: 'Todos'            },
  { key: 'falta_marcacao', label: 'Sem marcação'     },
  { key: 'atraso',         label: 'Atraso'           },
  { key: 'invalido',       label: 'Inválido'         },
  { key: 'jornada',        label: 'Prob. de jornada' },
  { key: 'hora_extra',     label: 'Hora extra'       },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function tipoInconsistenciaClasse(tipo: string) {
  const mapa: Record<string, string> = {
    falta_marcacao: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    atraso:         'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    invalido:       'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    jornada:        'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    hora_extra:     'bg-blue-100 text-blue-700 dark:bg-blue-900/35 dark:text-blue-300',
  }
  return mapa[tipo] || 'bg-[#f3f4f6] text-[#6b7280]'
}

function tipoClasse(tipo: string) {
  const mapa: Record<string, string> = {
    'Entrada': 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    'Saída':   'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    'Ausente': 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400',
  }
  return mapa[tipo] || 'bg-[#f3f4f6] text-[#6b7280]'
}

function situacaoClasse(situacao: string) {
  const mapa: Record<string, string> = {
    'No horário': 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400',
    'Atrasado':   'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
    'Hora Extra': 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    'Ausente':    'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  }
  return mapa[situacao] || 'bg-[#f3f4f6] text-[#6b7280]'
}
</script>
