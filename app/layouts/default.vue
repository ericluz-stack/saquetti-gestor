<template>
  <div class="flex h-screen overflow-hidden bg-[#f9fafb] dark:bg-[#0f172a]">

    <!-- Overlay mobile -->
    <Transition name="fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-20 bg-black/40 lg:hidden"
        @click="mobileOpen = false"
      />
    </Transition>

    <!-- Overlay fechar dropdowns -->
    <div
      v-if="perfilAberto || notifAberta || topPerfilAberto"
      class="fixed inset-0 z-40"
      @click="perfilAberto = false; notifAberta = false; topPerfilAberto = false"
    />

    <!-- ═══════════════════════════════════════════
         SIDEBAR
    ═══════════════════════════════════════════ -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-[#1e293b] border-r border-[#e5e7eb] dark:border-[#334155]',
        'transition-[width,transform] duration-300 ease-in-out overflow-hidden',
        collapsed ? 'w-[64px]' : 'w-[240px]',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ]"
    >
      <!-- Logo -->
      <div
        :class="[
          'flex h-[60px] flex-shrink-0 items-center border-b border-[#f3f4f6] dark:border-[#334155] px-4',
          collapsed ? 'justify-center' : 'justify-between',
        ]"
      >
        <div class="flex min-w-0 items-center gap-2.5">
          <img :src="isDark ? '/logotipobranco.svg' : '/logotipocolor.svg'" class="h-7 w-7 flex-shrink-0" alt="Saquetti" />
          <span v-if="!collapsed" class="truncate text-sm font-bold text-[#111827] dark:text-[#f1f5f9]">Saquetti</span>
        </div>
        <button
          v-if="!collapsed"
          @click="collapsed = true"
          class="hidden h-7 w-7 items-center justify-center rounded-md text-[#9ca3af] dark:text-[#64748b] transition-colors hover:bg-[#f3f4f6] dark:hover:bg-[#334155] lg:flex"
          aria-label="Colapsar menu"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <!-- Botão expandir (modo colapsado) -->
      <div v-if="collapsed" class="hidden justify-center border-b border-[#f3f4f6] dark:border-[#334155] py-2 lg:flex">
        <button
          @click="collapsed = false"
          class="flex h-7 w-7 items-center justify-center rounded-md text-[#9ca3af] dark:text-[#64748b] transition-colors hover:bg-[#f3f4f6] dark:hover:bg-[#334155]"
          aria-label="Expandir menu"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Navegação -->
      <nav class="flex-1 overflow-y-auto px-2 py-1">
        <template v-for="grupo in navGrupos" :key="grupo.label">

          <!-- Rótulo do grupo — colapsável quando sidebar expandida -->
          <button
            v-if="!collapsed"
            @click="toggleGrupo(grupo.label)"
            class="flex w-full items-center justify-between mb-1 mt-4 px-2 py-0.5 rounded text-left hover:bg-[#f9fafb] dark:hover:bg-[#334155] transition-colors group"
          >
            <span class="text-[10px] font-semibold uppercase tracking-wider text-[#9ca3af] dark:text-[#64748b] group-hover:text-[#6b7280] dark:group-hover:text-[#94a3b8] transition-colors">
              {{ grupo.label }}
            </span>
            <svg
              class="h-3 w-3 text-[#c0c4cc] dark:text-[#475569] transition-transform duration-200"
              :class="gruposAbertos[grupo.label] ? 'rotate-0' : '-rotate-90'"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-else class="mx-auto mb-1 mt-4 h-px w-8 bg-[#e5e7eb] dark:bg-[#334155]" />

          <!-- Itens do grupo -->
          <template v-if="collapsed || gruposAbertos[grupo.label]">
            <NuxtLink
              v-for="item in grupo.items"
              :key="item.to"
              :to="item.to"
              :title="collapsed ? item.label : undefined"
              :class="[
                'relative flex items-center rounded-lg px-2 py-2 text-sm font-medium transition-colors',
                collapsed ? 'justify-center' : 'gap-3',
                isActive(item.to)
                  ? 'bg-[#eff6ff] dark:bg-[#1e3a5f] text-[#155dfc] dark:text-[#60a5fa]'
                  : 'text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155] hover:text-[#111827] dark:hover:text-[#f1f5f9]',
              ]"
            >
              <span
                v-html="item.icon"
                :class="['flex-shrink-0 [&>svg]:h-[18px] [&>svg]:w-[18px]', isActive(item.to) ? 'text-[#155dfc] dark:text-[#60a5fa]' : 'text-[#6b7280] dark:text-[#94a3b8]']"
              />
              <span v-if="!collapsed" class="flex-1 truncate">{{ item.label }}</span>
              <span
                v-if="!collapsed && item.badge"
                class="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#155dfc] dark:bg-blue-700 px-1 text-[10px] font-bold text-white"
              >
                {{ item.badge }}
              </span>
              <span
                v-if="collapsed && item.badge"
                class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#155dfc] dark:bg-blue-600"
              />
            </NuxtLink>
          </template>

        </template>
      </nav>

      <!-- Rodapé da sidebar -->
      <div class="flex-shrink-0 border-t border-[#f3f4f6] dark:border-[#334155] px-2 py-2 space-y-0.5">

        <!-- Perfil do usuário com dropdown -->
        <div class="relative pt-0.5">

          <!-- Dropdown do perfil (abre para cima) -->
          <Transition name="slide-up">
            <div
              v-if="perfilAberto"
              class="absolute bottom-full left-0 right-0 z-50 mb-2 rounded-xl border border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] py-1 shadow-lg"
            >
              <!-- Cabeçalho do dropdown -->
              <div class="px-3 py-2 border-b border-[#f3f4f6] dark:border-[#334155]">
                <p class="text-xs font-semibold text-[#111827] dark:text-[#f1f5f9] truncate">{{ user?.nome }}</p>
                <p class="text-[10px] text-[#9ca3af] dark:text-[#64748b] truncate">{{ user?.email }}</p>
              </div>

              <NuxtLink
                to="/perfil"
                @click="perfilAberto = false"
                class="flex items-center gap-2.5 px-3 py-2 text-sm text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155] transition-colors"
              >
                <svg class="h-4 w-4 text-[#6b7280] dark:text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Meu Perfil
              </NuxtLink>

              <NuxtLink
                to="/configuracoes"
                @click="perfilAberto = false"
                class="flex items-center gap-2.5 px-3 py-2 text-sm text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155] transition-colors"
              >
                <svg class="h-4 w-4 text-[#6b7280] dark:text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Configurações
              </NuxtLink>

              <div class="mx-3 my-1 h-px bg-[#f3f4f6] dark:bg-[#334155]" />

              <button
                @click="perfilAberto = false; handleLogout()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          </Transition>

          <!-- Botão do perfil -->
          <button
            @click.stop="perfilAberto = !perfilAberto"
            :class="[
              'flex w-full items-center rounded-lg px-2 py-2 transition-colors',
              perfilAberto ? 'bg-[#f3f4f6] dark:bg-[#334155]' : 'hover:bg-[#f9fafb] dark:hover:bg-[#334155]',
              collapsed ? 'justify-center' : 'gap-2.5',
            ]"
          >
            <div
              class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#155dfc] to-[#2d3aed] dark:from-[#1e40af] dark:to-[#1e3a8a] text-[11px] font-bold text-white"
            >
              {{ user?.nome?.[0]?.toUpperCase() || 'U' }}
            </div>
            <div v-if="!collapsed" class="min-w-0 flex-1 text-left">
              <p class="truncate text-xs font-semibold text-[#111827] dark:text-[#f1f5f9]">{{ user?.nome }}</p>
              <p class="truncate text-[10px] text-[#9ca3af] dark:text-[#64748b]">{{ user?.email }}</p>
            </div>
            <svg
              v-if="!collapsed"
              class="h-3.5 w-3.5 flex-shrink-0 text-[#9ca3af] dark:text-[#64748b] transition-transform duration-200"
              :class="perfilAberto ? 'rotate-180' : ''"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- ═══════════════════════════════════════════
         ÁREA PRINCIPAL
    ═══════════════════════════════════════════ -->
    <div
      :class="[
        'flex flex-1 flex-col overflow-hidden transition-[padding] duration-300',
        collapsed ? 'lg:pl-[64px]' : 'lg:pl-[240px]',
      ]"
    >
      <!-- Topbar -->
      <header class="flex h-[60px] flex-shrink-0 items-center gap-4 border-b border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] px-4 lg:px-6">

        <!-- Hamburger mobile -->
        <button
          class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-[#6b7280] dark:text-[#94a3b8] transition-colors hover:bg-[#f3f4f6] dark:hover:bg-[#334155] lg:hidden"
          @click="mobileOpen = !mobileOpen"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-1.5 text-sm">
          <span class="text-[#9ca3af] dark:text-[#64748b]">Páginas</span>
          <svg class="h-3.5 w-3.5 text-[#d1d5db] dark:text-[#475569]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          <span class="font-semibold text-[#111827] dark:text-[#f1f5f9]">{{ paginaAtual }}</span>
        </nav>

        <!-- Espaçador -->
        <div class="flex-1" />

        <!-- Pesquisa -->
        <div class="relative hidden md:block">
          <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9ca3af] dark:text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Pesquisar funcionários, registros..."
            class="h-9 w-60 rounded-lg border border-[#e5e7eb] dark:border-[#334155] bg-[#f9fafb] dark:bg-[#0f172a] pl-9 pr-4 text-sm text-[#374151] dark:text-[#cbd5e1] placeholder-[#9ca3af] dark:placeholder-[#64748b] outline-none transition focus:border-[#155dfc] focus:bg-white dark:focus:bg-[#1e293b] focus:ring-2 focus:ring-[#155dfc]/20"
          />
        </div>

        <!-- Divisor -->
        <div class="hidden h-6 w-px bg-[#e5e7eb] dark:bg-[#334155] md:block" />

        <!-- Ações agrupadas -->
        <div class="flex items-center gap-0.5">

          <!-- Notificações com dropdown -->
          <div class="relative">
            <button
              @click.stop="notifAberta = !notifAberta; perfilAberto = false"
              :class="[
                'relative flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                notifAberta ? 'bg-[#f3f4f6] dark:bg-[#334155] text-[#374151] dark:text-[#cbd5e1]' : 'text-[#9ca3af] dark:text-[#64748b] hover:bg-[#f3f4f6] dark:hover:bg-[#334155] hover:text-[#374151] dark:hover:text-[#cbd5e1]',
              ]"
              title="Notificações"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span class="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-[#ef4444] dark:bg-red-400/75" />
            </button>

            <!-- Painel de notificações -->
            <Transition name="slide-down">
              <div
                v-if="notifAberta"
                class="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] shadow-lg"
              >
                <div class="flex items-center justify-between border-b border-[#f3f4f6] dark:border-[#334155] px-4 py-3">
                  <span class="text-sm font-semibold text-[#111827] dark:text-[#f1f5f9]">Notificações</span>
                  <span class="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#155dfc] dark:bg-blue-700 px-1.5 text-[10px] font-bold text-white">3</span>
                </div>

                <ul class="divide-y divide-[#f3f4f6] dark:divide-[#334155]">
                  <li
                    v-for="n in notificacoes"
                    :key="n.id"
                    class="flex items-start gap-3 px-4 py-3 hover:bg-[#f9fafb] dark:hover:bg-[#334155] transition-colors cursor-pointer"
                  >
                    <span :class="['mt-0.5 h-2 w-2 flex-shrink-0 rounded-full', n.urgente ? 'bg-[#ef4444] dark:bg-red-400/75' : 'bg-[#155dfc] dark:bg-blue-600']" />
                    <div class="min-w-0 flex-1">
                      <p class="text-xs text-[#374151] dark:text-[#cbd5e1] leading-snug">{{ n.texto }}</p>
                      <p class="mt-0.5 text-[10px] text-[#9ca3af] dark:text-[#64748b]">{{ n.tempo }}</p>
                    </div>
                  </li>
                </ul>

                <div class="border-t border-[#f3f4f6] dark:border-[#334155] px-4 py-2.5">
                  <NuxtLink
                    to="/notificacoes"
                    @click="notifAberta = false"
                    class="text-xs font-medium text-[#155dfc] dark:text-[#60a5fa] hover:underline"
                  >
                    Ver todas as notificações
                  </NuxtLink>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Dark mode toggle -->
          <button
            @click="toggle"
            :title="isDark ? 'Modo claro' : 'Modo escuro'"
            class="flex h-7 w-7 items-center justify-center rounded-md text-[#9ca3af] dark:text-[#64748b] transition-colors hover:bg-[#f3f4f6] dark:hover:bg-[#334155] hover:text-[#374151] dark:hover:text-[#cbd5e1]"
          >
            <!-- Sol — visível quando dark mode ativo -->
            <svg v-show="isDark" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
            </svg>
            <!-- Lua — visível quando modo claro ativo -->
            <svg v-show="!isDark" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Configurações -->
          <NuxtLink
            to="/configuracoes"
            class="flex h-7 w-7 items-center justify-center rounded-md text-[#9ca3af] dark:text-[#64748b] transition-colors hover:bg-[#f3f4f6] dark:hover:bg-[#334155] hover:text-[#374151] dark:hover:text-[#cbd5e1]"
            title="Configurações"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </NuxtLink>
        </div>

        <!-- Divisor -->
        <div class="h-5 w-px bg-[#e5e7eb] dark:bg-[#334155]" />

        <!-- Usuário com dropdown -->
        <div class="relative">

          <!-- Dropdown (abre para baixo) -->
          <Transition name="slide-down">
            <div
              v-if="topPerfilAberto"
              class="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-[#e5e7eb] dark:border-[#334155] bg-white dark:bg-[#1e293b] py-1 shadow-lg"
            >
              <!-- Cabeçalho -->
              <div class="px-3 py-2.5 border-b border-[#f3f4f6] dark:border-[#334155]">
                <p class="text-xs font-semibold text-[#111827] dark:text-[#f1f5f9] truncate">{{ user?.nome }}</p>
                <p class="text-[10px] text-[#9ca3af] dark:text-[#64748b] truncate">{{ user?.email }}</p>
              </div>

              <NuxtLink
                to="/perfil"
                @click="topPerfilAberto = false"
                class="flex items-center gap-2.5 px-3 py-2 text-sm text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155] transition-colors"
              >
                <svg class="h-4 w-4 text-[#6b7280] dark:text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Minha Conta
              </NuxtLink>

              <NuxtLink
                to="/configuracoes"
                @click="topPerfilAberto = false"
                class="flex items-center gap-2.5 px-3 py-2 text-sm text-[#374151] dark:text-[#cbd5e1] hover:bg-[#f9fafb] dark:hover:bg-[#334155] transition-colors"
              >
                <svg class="h-4 w-4 text-[#6b7280] dark:text-[#94a3b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Configurações
              </NuxtLink>

              <div class="mx-3 my-1 h-px bg-[#f3f4f6] dark:bg-[#334155]" />

              <button
                @click="topPerfilAberto = false; handleLogout()"
                class="flex w-full items-center gap-2.5 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair da Conta
              </button>
            </div>
          </Transition>

          <!-- Botão usuário -->
          <button
            @click.stop="topPerfilAberto = !topPerfilAberto; notifAberta = false; perfilAberto = false"
            :class="[
              'flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors',
              topPerfilAberto ? 'bg-[#f3f4f6] dark:bg-[#334155]' : 'hover:bg-[#f3f4f6] dark:hover:bg-[#334155]',
            ]"
          >
            <div class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#155dfc] to-[#2d3aed] dark:from-[#1e40af] dark:to-[#1e3a8a] text-[11px] font-bold text-white">
              {{ user?.nome?.[0]?.toUpperCase() || 'U' }}
            </div>
            <div class="hidden text-left lg:block">
              <p class="text-xs font-semibold leading-none text-[#111827] dark:text-[#f1f5f9]">{{ user?.nome }}</p>
              <p class="mt-0.5 text-[10px] leading-none text-[#9ca3af] dark:text-[#64748b]">{{ user?.papel === 'admin' ? 'Administrador' : user?.papel === 'gerente' ? 'Gerente' : 'Funcionário' }}</p>
            </div>
            <svg
              class="hidden h-3 w-3 text-[#9ca3af] dark:text-[#64748b] transition-transform duration-200 lg:block"
              :class="topPerfilAberto ? 'rotate-180' : ''"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </header>

      <!-- Conteúdo da página -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>

  </div>
</template>

<script setup lang="ts">
const { user, logout } = useAuth()
const route = useRoute()
const router = useRouter()

const collapsed = useState('sidebar.collapsed', () => false)
const mobileOpen = ref(false)
const perfilAberto = ref(false)
const topPerfilAberto = ref(false)
const notifAberta = ref(false)

async function handleLogout() {
  await logout()
  await router.replace({ path: '/login', query: { saida: '1' } })
}

const { isDark, toggle } = useAppColorMode()

// Grupos de navegação abertos/fechados
const gruposAbertos = ref<Record<string, boolean>>({
  'Geral': true,
  'Gestão': true,
  'Ponto Eletrônico': true,
})

function toggleGrupo(label: string) {
  gruposAbertos.value[label] = !gruposAbertos.value[label]
}

function isActive(to: string) {
  if (to === '/dashboard') return route.path === to
  return route.path.startsWith(to)
}

const paginaAtual = computed(() => {
  const labels: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/funcionarios': 'Funcionários',
    '/departamentos': 'Departamentos',
    '/cargos': 'Cargos',
    '/registros': 'Registros de Ponto',
    '/jornadas': 'Jornadas',
    '/relatorios': 'Relatórios',
    '/cartao-ponto': 'Cartão Ponto',
    '/solicitacoes': 'Solicitações',
    '/notificacoes': 'Notificações',
    '/configuracoes': 'Configurações',
    '/perfil': 'Meu Perfil',
  }
  return labels[route.path] || 'Página'
})

// Notificações mock
const notificacoes = [
  { id: 1, texto: 'João Silva registrou entrada com 18 min de atraso.', tempo: 'há 5 min', urgente: true },
  { id: 2, texto: '3 funcionários sem registro de entrada após às 09h.', tempo: 'há 23 min', urgente: true },
  { id: 3, texto: 'Relatório mensal de março está disponível para download.', tempo: 'há 1h', urgente: false },
]

// ─── Ícones inline (SVG strings) ───────────────────────────────────────────
const icons = {
  dashboard: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`,
  users: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`,
  building: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>`,
  briefcase: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
  clipboard: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>`,
  calendar: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>`,
  chart: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`,
}

// ─── Grupos de navegação ─────────────────────────────────────────────────────
const navGrupos = [
  {
    label: 'Geral',
    items: [
      { label: 'Dashboard', to: '/dashboard', icon: icons.dashboard, badge: null },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { label: 'Funcionários', to: '/funcionarios', icon: icons.users, badge: null },
      { label: 'Departamentos', to: '/departamentos', icon: icons.building, badge: null },
      { label: 'Cargos', to: '/cargos', icon: icons.briefcase, badge: null },
    ],
  },
  {
    label: 'Ponto Eletrônico',
    items: [
      { label: 'Registros', to: '/registros', icon: icons.clipboard, badge: 3 },
      { label: 'Jornadas', to: '/jornadas', icon: icons.calendar, badge: null },
      { label: 'Relatórios', to: '/relatorios', icon: icons.chart, badge: null },
    ],
  },
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
