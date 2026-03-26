/**
 * Converte erros técnicos de $fetch/ofetch em texto compreensível para o usuário final.
 */

export type ContextoErroApi = 'login' | 'recuperar-senha' | 'sessao' | 'geral'

type CorpoErro = {
  message?: string
  statusMessage?: string
}

function comoObjetoErro(erro: unknown): {
  message: string
  statusCode?: number
  data?: CorpoErro
} {
  if (!erro || typeof erro !== 'object') {
    return { message: '' }
  }
  const e = erro as Record<string, unknown>
  const message = typeof e.message === 'string' ? e.message : ''
  const statusCode = typeof e.statusCode === 'number' ? e.statusCode : undefined
  const data = e.data && typeof e.data === 'object' ? (e.data as CorpoErro) : undefined
  return { message, statusCode, data }
}

/** Mensagens que vêm do backend e já são adequadas ao usuário. */
function mensagemServidorAmigavel(data?: CorpoErro): string | null {
  const m = data?.message?.trim() || data?.statusMessage?.trim()
  if (!m) return null
  if (mensagemPareceTecnicaDemais(m)) return null
  return m
}

/** Evita mostrar "Page not found: /api/..." ou stack ao usuário. */
function mensagemPareceTecnicaDemais(texto: string): boolean {
  const t = texto.toLowerCase()
  if (/page not found|not found:\s*\//.test(t)) return true
  if (/\[?(get|post|put|patch|delete)\]?\s*["']?\//i.test(t)) return true
  if (/\/api\/[^\s]+/i.test(t) && /not found|404|não encontrad/i.test(t)) return true
  if (/econnrefused|enotfound|network\s*error|failed to fetch/i.test(t)) return true
  if (/^\d{3}\s/.test(texto.trim())) return true
  return false
}

function texto404(contexto: ContextoErroApi): string {
  const base =
    'O sistema não conseguiu acessar o serviço no servidor. Isso costuma acontecer quando o site é aberto sem o servidor de desenvolvimento ativo (por exemplo, abrindo só arquivos estáticos ou uma pré-visualização incompleta).'
  const dica =
    'No seu computador, abra o terminal na pasta do projeto, rode npm run dev e use exatamente o endereço que o terminal mostrar (geralmente http://localhost:3000).'
  const fim = 'Se você já faz isso e o erro continua, pode ser rede ou configuração do ambiente — avise o suporte técnico.'

  if (contexto === 'login') {
    return `${base} ${dica} ${fim}`
  }
  if (contexto === 'recuperar-senha') {
    return `${base} ${dica} Assim o envio do link de recuperação volta a funcionar.`
  }
  return `${base} ${dica} ${fim}`
}

function parece404(message: string, statusCode?: number): boolean {
  if (statusCode === 404) return true
  const t = message.toLowerCase()
  return /page not found|404/.test(t) && /\/api\//i.test(message)
}

function pareceFalhaDeRede(erro: unknown, message: string): boolean {
  const t = message.toLowerCase()
  if (erro instanceof TypeError && /fetch|network|load failed/i.test(message)) return true
  if (/failed to fetch|networkerror|load failed|econnrefused|enotfound|aborted|timeout/i.test(t)) {
    return true
  }
  return false
}

/**
 * @param erro — valor capturado no catch de $fetch
 * @param opcoes.contexto — ajusta o texto do 404 ao fluxo (login, recuperação, etc.)
 * @param opcoes.fallback — mensagem se nada mais se aplicar
 */
export function mensagemErroParaUsuario(
  erro: unknown,
  opcoes?: {
    contexto?: ContextoErroApi
    fallback?: string
  },
): string {
  const contexto = opcoes?.contexto ?? 'geral'
  const fallback = opcoes?.fallback ?? 'Algo deu errado. Tente de novo em instantes.'

  const { message, statusCode, data } = comoObjetoErro(erro)

  const doServidor = mensagemServidorAmigavel(data)
  if (doServidor) return doServidor

  if (pareceFalhaDeRede(erro, message)) {
    return 'Não foi possível conectar ao servidor. Confira sua internet, se o sistema está no ar e tente novamente.'
  }

  if (parece404(message, statusCode)) {
    return texto404(contexto)
  }

  if (statusCode === 401) {
    if (contexto === 'login') {
      return 'E-mail ou senha incorretos. Verifique os dados e tente novamente.'
    }
    return 'Sua sessão expirou ou você não tem autorização. Faça login novamente.'
  }

  if (statusCode === 403) {
    return 'Você não tem permissão para esta ação. Fale com quem administra o sistema.'
  }

  if (statusCode === 408 || statusCode === 504) {
    return 'A conexão demorou demais para responder. Verifique sua rede e tente novamente.'
  }

  if (statusCode === 429) {
    return 'Muitas tentativas em pouco tempo. Aguarde um momento e tente de novo.'
  }

  if (statusCode === 400) {
    return 'Alguns dados não foram aceitos. Confira as informações e tente novamente.'
  }

  if (statusCode !== undefined && statusCode >= 500) {
    return 'O servidor está passando por uma instabilidade. Tente de novo em alguns minutos ou entre em contato com o suporte.'
  }

  if (message && !mensagemPareceTecnicaDemais(message)) {
    return message
  }

  return fallback
}
