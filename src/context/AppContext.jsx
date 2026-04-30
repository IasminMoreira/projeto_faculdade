import { createContext, useContext, useState } from 'react'
import { usuarioAtual, itens as itensIniciais, conversas as conversasIniciais, notificacoes as notificacoesIniciais } from '../data/mock'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(usuarioAtual)
  const [autenticado, setAutenticado] = useState(false)
  const [itens, setItens] = useState(itensIniciais)
  const [conversas, setConversas] = useState(conversasIniciais)
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais)

  function login() { setAutenticado(true) }
  function logout() { setAutenticado(false) }

  function atualizarUsuario(dados) { setUsuario(prev => ({ ...prev, ...dados })) }

  function marcarNotificacaoLida(id) {
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n))
  }
  function marcarTodasLidas() {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })))
  }

  function adicionarItem(novoItem) {
    setItens(prev => [{
      ...novoItem,
      id: `i${Date.now()}`,
      doadorId: usuario.id,
      interessados: 0,
      status: 'ativo',
    }, ...prev])
  }

  function marcarComoDoado(itemId) {
    setItens(prev => prev.map(i => i.id === itemId ? { ...i, status: 'doado' } : i))
  }

  function excluirItem(itemId) {
    setItens(prev => prev.filter(i => i.id !== itemId))
  }

  function editarItem(itemId, dados) {
    setItens(prev => prev.map(i => i.id === itemId ? { ...i, ...dados } : i))
  }

  // Garante UMA conversa por (participante + item), sem duplicatas
  function criarOuAbrirConversa(participanteId, itemId) {
    // Busca conversa exata com esse par
    const existente = conversas.find(
      c => c.participanteId === participanteId && c.itemId === itemId
    )
    if (existente) return existente.id

    const novaId = `c${Date.now()}`
    setConversas(prev => [{
      id: novaId,
      participanteId,
      itemId,
      ultimaMensagem: '',
      horario: 'agora',
      naoLidas: 0,
      mensagens: [],
    }, ...prev])
    return novaId
  }

  function enviarMensagem(conversaId, texto) {
    const nova = {
      id: `m${Date.now()}`,
      autorId: usuario.id,
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
  const meusItens = itens.filter(i => i.doadorId === usuario.id)

  return (
    <AppContext.Provider value={{
      usuario, autenticado, login, logout, atualizarUsuario,
      itens, meusItens, conversas, notificacoes, notificacoesNaoLidas,
      marcarNotificacaoLida, marcarTodasLidas,
      adicionarItem, marcarComoDoado, excluirItem, editarItem,
      criarOuAbrirConversa, enviarMensagem,
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
