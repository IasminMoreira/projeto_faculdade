import { createContext, useContext, useState, useEffect } from 'react'
import { auth, loginComGoogle, fazerLogout } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { itens as itensIniciais, conversas as conversasIniciais, notificacoes as notificacoesIniciais, usuarioAtual } from '../data/mock'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [autenticado, setAutenticado] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [itens, setItens] = useState(itensIniciais)
  const [conversas, setConversas] = useState(conversasIniciais)
  const [notificacoes, setNotificacoes] = useState(notificacoesIniciais)

  // Observa mudanças de auth do Firebase
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuario({
          id: user.uid,
          nome: user.displayName || 'Usuário',
          email: user.email,
          avatar: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=ffc9b8&color=a04030`,
          cidade: 'São Paulo, SP',
          avaliacao: 4.9,
          totalDoacoes: 0,
          itensRecebidos: 0,
          anosNaPlataforma: 0,
        })
        setAutenticado(true)
      } else {
        setUsuario(null)
        setAutenticado(false)
      }
      setCarregando(false)
    })
    return () => unsub()
  }, [])

  async function loginGoogle() {
    try {
      const dadosUsuario = await loginComGoogle()
      setUsuario(dadosUsuario)
      setAutenticado(true)
    } catch (erro) {
      console.error('Erro no login Google:', erro)
      throw erro
    }
  }

  // Login simples (e-mail/senha simulado)
  function login() {
    setUsuario(usuarioAtual)
    setAutenticado(true)
  }

  async function logout() {
    try {
      await fazerLogout()
    } catch (e) {}
    setUsuario(null)
    setAutenticado(false)
  }

  function atualizarUsuario(dados) {
    setUsuario(prev => ({ ...prev, ...dados }))
  }

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
      doadorId: usuario?.id || 'u1',
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
      autorId: usuario?.id || 'u1',
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
  const meusItens = itens.filter(i => i.doadorId === (usuario?.id || 'u1'))

  if (carregando) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#fffdf9', flexDirection: 'column', gap: 16,
      }}>
        <img src="/src/assets/logo.png" alt="Doa aí" style={{ height: 80 }}/>
        <p style={{ color: '#7a5e55', fontSize: 15 }}>Carregando...</p>
      </div>
    )
  }

  return (
    <AppContext.Provider value={{
      usuario, autenticado, login, loginGoogle, logout, atualizarUsuario,
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
