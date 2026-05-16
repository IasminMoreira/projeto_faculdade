import { createContext, useContext, useState, useEffect } from 'react'
import { apiLogin, apiRegistrar, apiLogout, apiUsuarioAtual } from '../api/auth'
import { apiListarItens, apiMeusItens, apiCriarItem, apiEditarItem, apiExcluirItem, apiMarcarDoado } from '../api/itens'
import { conversas as conversasIniciais, notificacoes as notificacoesIniciais } from '../data/mock'

const AppContext = createContext(null)

// ── Normaliza item do Laravel para o formato que o front espera ───────────────
function normalizeItem(item) {
  return {
    id:             item.id,
    titulo:         item.titulo,
    descricao:      item.descricao,
    categoria:      item.categoria,
    condicao:       item.condicao,
    localizacao:    item.localizacao ?? '',
    lat:            item.lat ?? null,
    lng:            item.lng ?? null,
    distancia:      item.distancia ?? '0km',
    doadorId:       item.user_id,
    fotos:          Array.isArray(item.fotos) && item.fotos.length > 0
                      ? item.fotos
                      : ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80'],
    publicadoEm:    item.created_at?.split('T')[0] ?? '',
    status:         item.status ?? 'ativo',
    interessados:   item.interessados ?? 0,
    negociacaoInfo: item.negociacao_info ?? null,
    doador: item.user ? {
      id:        item.user.id,
      nome:      item.user.name,
      avatar:    item.user.avatar_url
                   ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user.name)}&background=ffc9b8&color=a04030`,
      cidade:    item.user.cidade    ?? '',
      avaliacao: item.user.avaliacao ?? 4.9,
    } : null,
  }
}

// ── Normaliza usuário do Laravel para o formato do front ──────────────────────
function normalizeUsuario(user) {
  return {
    id:               user.id,
    nome:             user.name,
    email:            user.email,
    avatar:           user.avatar_url
                        ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ffc9b8&color=a04030`,
    cidade:           user.cidade          ?? 'São Paulo, SP',
    avaliacao:        user.avaliacao       ?? 4.9,
    totalDoacoes:     user.total_doacoes   ?? 0,
    itensRecebidos:   user.itens_recebidos ?? 0,
    anosNaPlataforma: user.anos_plataforma ?? 0,
  }
}

export function AppProvider({ children }) {
  const [usuario, setUsuario]           = useState(null)
  const [autenticado, setAutenticado]   = useState(false)
  const [carregando, setCarregando]     = useState(true)
  const [itens, setItens]               = useState([])
  const [meusItensState, setMeusItens]  = useState([])
  const [conversas, setConversas]       = useState(conversasIniciais)
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais)

  // ── Verifica sessão ativa ao iniciar ────────────────────────────────────────
  useEffect(() => {
    apiUsuarioAtual()
      .then((user) => {
        setUsuario(normalizeUsuario(user))
        setAutenticado(true)
      })
      .catch(() => setAutenticado(false))
      .finally(() => setCarregando(false))
  }, [])

  // ── Carrega itens após autenticar ───────────────────────────────────────────
  useEffect(() => {
    if (!autenticado) return
    carregarItens()
    carregarMeusItens()
  }, [autenticado])

  async function carregarItens() {
    try {
      const data = await apiListarItens()
      setItens(data.map(normalizeItem))
    } catch (e) { console.error('Erro ao carregar itens:', e) }
  }

  async function carregarMeusItens() {
    try {
      const data = await apiMeusItens()
      setMeusItens(data.map(normalizeItem))
    } catch (e) { console.error('Erro ao carregar meus itens:', e) }
  }

  // ── Auth ───────────────────────────────────────────────────────────────────
  async function login(email, senha) {
    const user = await apiLogin(email, senha)
    setUsuario(normalizeUsuario(user))
    setAutenticado(true)
  }

  async function registrar(nome, email, senha) {
    const user = await apiRegistrar(nome, email, senha)
    setUsuario(normalizeUsuario(user))
    setAutenticado(true)
  }

  async function logout() {
    try { await apiLogout() } catch (e) {}
    setUsuario(null)
    setAutenticado(false)
    setItens([])
    setMeusItens([])
  }

  function atualizarUsuario(dados) {
    setUsuario(prev => ({ ...prev, ...dados }))
  }

  // ── Itens ──────────────────────────────────────────────────────────────────
  async function adicionarItem(novoItem) {
    const payload = {
      titulo:      novoItem.titulo,
      descricao:   novoItem.descricao,
      categoria:   novoItem.categoria,
      condicao:    novoItem.condicao,
      localizacao: novoItem.localizacao ?? '',
      lat:         novoItem.lat   ?? null,
      lng:         novoItem.lng   ?? null,
      fotos:       novoItem.fotos ?? [],   // array de base64 ou URLs
    }
    const criado = await apiCriarItem(payload)
    const normalizado = normalizeItem(criado)
    setMeusItens(prev => [normalizado, ...prev])
    setItens(prev => [normalizado, ...prev])
    return normalizado
  }

  async function editarItem(itemId, dados) {
    const atualizado = await apiEditarItem(itemId, dados)
    const normalizado = normalizeItem(atualizado)
    const update = (prev) => prev.map(i => i.id === itemId ? normalizado : i)
    setItens(update)
    setMeusItens(update)
  }

  async function excluirItem(itemId) {
    await apiExcluirItem(itemId)
    const remove = (prev) => prev.filter(i => i.id !== itemId)
    setItens(remove)
    setMeusItens(remove)
  }

  async function marcarComoDoado(itemId) {
    const atualizado = await apiMarcarDoado(itemId)
    const normalizado = normalizeItem(atualizado)
    const update = (prev) => prev.map(i => i.id === itemId ? normalizado : i)
    setItens(update)
    setMeusItens(update)
  }

  // ── Notificações (locais por enquanto) ─────────────────────────────────────
  function marcarNotificacaoLida(id) {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n))
  }
  function marcarTodasLidas() {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
  }

  // ── Conversas (locais por enquanto) ────────────────────────────────────────
  function criarOuAbrirConversa(participanteId, itemId) {
    const existente = conversas.find(c => c.participanteId === participanteId && c.itemId === itemId)
    if (existente) return existente.id
    const novaId = `c${Date.now()}`
    setConversas(prev => [{
      id: novaId, participanteId, itemId,
      ultimaMensagem: '', horario: 'agora', naoLidas: 0, mensagens: [],
    }, ...prev])
    return novaId
  }

  function enviarMensagem(conversaId, texto) {
    const nova = {
      id: `m${Date.now()}`,
      autorId: usuario?.id,
      texto,
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
    setConversas(prev => prev.map(c =>
      c.id === conversaId
        ? { ...c, mensagens: [...c.mensagens, nova], ultimaMensagem: texto, naoLidas: 0 }
        : c
    ))
  }

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length
  const meusItens = meusItensState

  if (carregando) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#fffdf9', flexDirection: 'column', gap: 16,
      }}>
        <img src="/src/assets/logo.png" alt="Doa aí" style={{ height: 80 }} />
        <p style={{ color: '#7a5e55', fontSize: 15 }}>Carregando...</p>
      </div>
    )
  }

  return (
    <AppContext.Provider value={{
      usuario, autenticado, login, registrar, logout, atualizarUsuario,
      itens, meusItens, conversas, notificacoes, notificacoesNaoLidas,
      marcarNotificacaoLida, marcarTodasLidas,
      adicionarItem, marcarComoDoado, excluirItem, editarItem,
      criarOuAbrirConversa, enviarMensagem,
      carregarItens, carregarMeusItens,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}
