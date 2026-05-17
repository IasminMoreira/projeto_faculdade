import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Avatar, Icone, Logo } from '../components/ui'
import { usuarios, itens } from '../data/mock'

const FILTROS = ['Todas', 'Doações', 'Anúncios']

export default function Mensagens() {
  const location = useLocation()
  const navigate = useNavigate()
  const { conversas, usuario, enviarMensagem, criarOuAbrirConversa } = useApp()
  const [conversaAtiva, setConversaAtiva] = useState(null)
  const [texto, setTexto] = useState('')
  const [filtro, setFiltro] = useState('Todas')
  const [modalOpcoes, setModalOpcoes] = useState(false)
  const [modalAnexo, setModalAnexo] = useState(false)
  const [modalEmoji, setModalEmoji] = useState(false)
  const msgEndRef = useRef(null)
  const processedState = useRef(null)
  const inputRef = useRef(null)
  const anexoRef = useRef(null)

  useEffect(() => {
    const state = location.state
    if (!state || processedState.current === JSON.stringify(state)) return
    processedState.current = JSON.stringify(state)

    if (state.conversaId) {
      setConversaAtiva(state.conversaId)
    } else if (state.novaConversa) {
      const { participanteId, itemId } = state.novaConversa
      const existente = conversas.find(c => c.participanteId === participanteId && c.itemId === itemId)
      if (existente) {
        setConversaAtiva(existente.id)
      } else {
        const novoId = criarOuAbrirConversa(participanteId, itemId)
        setConversaAtiva(novoId)
      }
    }
    window.history.replaceState({}, '')
  }, [location.state])

  useEffect(() => {
    if (conversaAtiva) {
      setTimeout(() => msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }, [conversaAtiva, conversas])

  // Remove conversas duplicadas (mesmo participante + mesmo item)
  const conversasUnicas = conversas.filter((c, idx, arr) =>
    arr.findIndex(x => x.participanteId === c.participanteId && x.itemId === c.itemId) === idx
  )

  const conversasFiltradas = conversasUnicas.filter(c => {
    const item = itens.find(i => i.id === c.itemId)
    if (filtro === 'Doações') return item?.doadorId !== usuario.id
    if (filtro === 'Anúncios') return item?.doadorId === usuario.id
    return true
  })

  const conversa = conversasUnicas.find(c => c.id === conversaAtiva)
  const participante = conversa ? usuarios.find(u => u.id === conversa.participanteId) : null
  const itemConversa = conversa ? itens.find(i => i.id === conversa.itemId) : null

  const emojis = ['😊','👍','🙏','❤️','😂','🎉','👋','✅','📦','🤝']

  function handleEnviar(e) {
    e.preventDefault()
    if (!texto.trim() || !conversaAtiva) return
    enviarMensagem(conversaAtiva, texto.trim())
    setTexto('')
    setModalEmoji(false)
  }

  function inserirEmoji(emoji) {
    setTexto(prev => prev + emoji)
    setModalEmoji(false)
    inputRef.current?.focus()
  }

  function handleAnexo(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      enviarMensagem(conversaAtiva, `📎 [Imagem enviada]`)
    }
    reader.readAsDataURL(file)
    setModalAnexo(false)
  }

  return (
    <div className="flex flex-col bg-background" style={{ height: 'calc(100vh - 64px)' }}>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-creme-300 flex items-center justify-between px-4 h-16 flex-shrink-0">
        <Logo height={72}/>
        <div className="flex gap-1">
          <button onClick={() => navigate('/notificacoes')} className="p-2 rounded-full hover:bg-creme-200 active:scale-95">
            <Icone nome="notifications" className="text-on-surface-muted" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`w-full md:w-72 lg:w-80 border-r border-creme-300 flex flex-col flex-shrink-0 ${conversaAtiva ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-lg border-b border-creme-300 flex-shrink-0">
            <h2 className="text-h2 font-h2 text-on-surface">Mensagens</h2>
          </div>

          <div className="flex flex-col gap-xs p-md border-b border-creme-300 flex-shrink-0">
            {FILTROS.map((f, i) => {
              const count = conversasUnicas.filter(c => {
                const item = itens.find(it => it.id === c.itemId)
                if (f === 'Doações') return item?.doadorId !== usuario.id
                if (f === 'Anúncios') return item?.doadorId === usuario.id
                return true
              }).length
              return (
                <button key={f} onClick={() => setFiltro(f)}
                  className={`flex items-center gap-md px-md py-sm rounded-lg text-left transition-colors
                    ${filtro === f ? 'bg-primary text-on-primary' : 'text-on-surface-muted hover:bg-creme-200'}`}>
                  <Icone nome={i === 0 ? 'chat' : i === 1 ? 'volunteer_activism' : 'inventory_2'} tamanho={20} />
                  <span className="text-label-md flex-1">{f}</span>
                  <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center
                    ${filtro === f ? 'bg-on-primary text-verde-600' : 'bg-creme-200 text-on-surface-muted'}`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversasFiltradas.length === 0 ? (
              <div className="p-xl text-center text-on-surface-muted">
                <Icone nome="chat_bubble_outline" tamanho={40} className="text-surface-container-highest mb-sm" />
                <p className="text-sm">Nenhuma conversa</p>
              </div>
            ) : conversasFiltradas.map(c => {
              const p = usuarios.find(u => u.id === c.participanteId)
              const it = itens.find(i => i.id === c.itemId)
              const ultimaMsg = c.mensagens[c.mensagens.length - 1]
              return (
                <button key={c.id} onClick={() => setConversaAtiva(c.id)}
                  className={`w-full flex items-center gap-md p-md border-b border-creme-300 text-left hover:bg-creme-200 transition-colors
                    ${conversaAtiva === c.id ? 'bg-coral-50 border-l-2 border-l-primary' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <Avatar src={p?.avatar} nome={p?.nome} tamanho={44} />
                    {c.naoLidas > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-xs">
                      <span className="font-semibold text-on-surface text-sm truncate">{p?.nome}</span>
                      <span className="text-xs text-on-surface-muted flex-shrink-0">{c.horario}</span>
                    </div>
                    <p className="text-sm text-on-surface-muted truncate">
                      {ultimaMsg?.texto || c.ultimaMensagem || 'Sem mensagens ainda'}
                    </p>
                  </div>
                  {it && <img src={it.fotos[0]} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />}
                </button>
              )
            })}
          </div>
        </aside>

        {/* Chat */}
        <div className={`flex-1 flex flex-col overflow-hidden ${!conversaAtiva ? 'hidden md:flex' : 'flex'}`}>
          {!conversa ? (
            <div className="flex-1 flex flex-col items-center justify-center text-on-surface-muted">
              <Icone nome="chat_bubble_outline" tamanho={64} className="text-surface-container-highest mb-md" />
              <p className="text-h3 font-h3">Selecione uma conversa</p>
              <p className="text-body-md mt-xs">Escolha à esquerda para começar</p>
            </div>
          ) : (
            <>
              {/* Header do chat */}
              <div className="flex items-center gap-md px-lg py-md border-b border-creme-300 bg-white flex-shrink-0">
                <button onClick={() => setConversaAtiva(null)} className="md:hidden p-1 rounded-full hover:bg-creme-200">
                  <Icone nome="arrow_back" className="text-on-surface-muted" />
                </button>
                <button onClick={() => navigate(`/perfil/${participante?.id}`)} className="flex items-center gap-md flex-1 text-left hover:bg-creme-200 rounded-lg p-sm -m-sm transition-colors">
                  <Avatar src={participante?.avatar} nome={participante?.nome} tamanho={40} />
                  <div>
                    <p className="font-semibold text-on-surface">{participante?.nome}</p>
                    <p className="text-xs text-verde-600 flex items-center gap-xs">
                      <span className="w-2 h-2 bg-primary rounded-full" />Online agora
                    </p>
                  </div>
                </button>
                <div className="flex gap-1 flex-shrink-0">
                  {/* Botão de ligar — abre discador do dispositivo */}
                  <button
                    onClick={() => alert('Recurso de chamada disponível em breve.\nCombine os detalhes pelo chat.')}
                    className="p-2 rounded-full hover:bg-creme-200 active:scale-95"
                    title="Ligar">
                    <Icone nome="call" className="text-on-surface-muted" />
                  </button>
                  {/* Mais opções */}
                  <button onClick={() => setModalOpcoes(true)} className="p-2 rounded-full hover:bg-creme-200 active:scale-95" title="Mais opções">
                    <Icone nome="more_vert" className="text-on-surface-muted" />
                  </button>
                </div>
              </div>

              {/* Card do item */}
              {itemConversa && (
                <button
                  onClick={() => navigate(`/item/${itemConversa.id}`)}
                  className="px-lg py-sm border-b border-creme-300 bg-creme-100 flex-shrink-0 hover:bg-creme-200 transition-colors w-full text-left">
                  <div className="flex items-center gap-md">
                    <img src={itemConversa.fotos[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="text-xs text-on-surface-muted uppercase tracking-wider font-semibold">Interesse em</p>
                      <p className="font-semibold text-on-surface text-sm">{itemConversa.titulo}</p>
                      <p className="text-xs text-verde-600">Disponível para doação</p>
                    </div>
                    <Icone nome="chevron_right" tamanho={18} className="text-on-surface-muted" />
                  </div>
                </button>
              )}

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto px-lg py-md space-y-md" onClick={() => { setModalEmoji(false); setModalOpcoes(false) }}>
                {conversa.mensagens.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-on-surface-muted text-center py-xxl">
                    <Icone nome="waving_hand" tamanho={48} className="text-tertiary mb-md" />
                    <p className="font-semibold">Diga olá para {participante?.nome}!</p>
                    <p className="text-sm mt-xs">Combine os detalhes da doação diretamente aqui.</p>
                    <p className="text-xs mt-md text-outline px-xl">A entrega é combinada entre as partes. O Doa aí não se responsabiliza pela logística.</p>
                  </div>
                ) : conversa.mensagens.map(msg => {
                  const minha = msg.autorId === usuario.id
                  return (
                    <div key={msg.id} className={`flex gap-sm ${minha ? 'justify-end' : 'justify-start'}`}>
                      {!minha && <Avatar src={participante?.avatar} nome={participante?.nome} tamanho={32} />}
                      <div className={`max-w-xs lg:max-w-sm rounded-2xl px-md py-sm
                        ${minha ? 'bg-primary text-on-primary rounded-br-sm' : 'bg-creme-100 text-on-surface rounded-bl-sm'}`}>
                        <p className="text-body-md">{msg.texto}</p>
                        <p className={`text-xs mt-xs ${minha ? 'text-on-primary/70' : 'text-on-surface-muted'}`}>{msg.horario}</p>
                      </div>
                    </div>
                  )
                })}
                <div ref={msgEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-creme-300 bg-white flex-shrink-0">
                {/* Picker de emoji */}
                {modalEmoji && (
                  <div className="px-lg py-sm border-b border-creme-300 flex gap-sm flex-wrap">
                    {emojis.map(e => (
                      <button key={e} onClick={() => inserirEmoji(e)}
                        className="text-2xl hover:scale-125 transition-transform active:scale-95">{e}</button>
                    ))}
                  </div>
                )}
                <form onSubmit={handleEnviar} className="flex items-center gap-md px-lg py-md">
                  {/* Botão + para anexar imagem */}
                  <div className="relative">
                    <button type="button" onClick={() => { setModalAnexo(!modalAnexo); setModalEmoji(false) }}
                      className="p-2 rounded-full hover:bg-creme-200 active:scale-95">
                      <Icone nome="add_circle" className="text-on-surface-muted" />
                    </button>
                    {modalAnexo && (
                      <div className="absolute bottom-12 left-0 bg-white rounded-xl shadow-modal border border-creme-300 overflow-hidden z-10 w-48">
                        <button type="button" onClick={() => anexoRef.current?.click()}
                          className="w-full flex items-center gap-md px-md py-sm hover:bg-creme-200 transition-colors text-left">
                          <Icone nome="photo" tamanho={20} className="text-on-surface-muted" />
                          <span className="text-sm font-medium">Enviar imagem</span>
                        </button>
                        <button type="button" onClick={() => { enviarMensagem(conversaAtiva, '📍 Localização compartilhada'); setModalAnexo(false) }}
                          className="w-full flex items-center gap-md px-md py-sm hover:bg-creme-200 transition-colors text-left">
                          <Icone nome="location_on" tamanho={20} className="text-on-surface-muted" />
                          <span className="text-sm font-medium">Compartilhar localização</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleAnexo} ref={anexoRef} />

                  <input value={texto} onChange={e => setTexto(e.target.value)}
                    onClick={() => { setModalEmoji(false); setModalAnexo(false) }}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 bg-creme-100 rounded-full px-md py-sm outline-none text-on-surface text-body-md" />

                  {/* Emoji picker */}
                  <button type="button" onClick={() => { setModalEmoji(!modalEmoji); setModalAnexo(false) }}
                    className="p-2 rounded-full hover:bg-creme-200 active:scale-95">
                    <Icone nome="sentiment_satisfied" className={`${modalEmoji ? 'text-verde-600' : 'text-on-surface-muted'}`} />
                  </button>

                  <button type="submit" disabled={!texto.trim()}
                    className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-sm active:scale-95 disabled:opacity-40 transition-all">
                    <Icone nome="send" tamanho={20} className="text-on-primary" />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal mais opções do chat */}
      {modalOpcoes && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center p-4" onClick={() => setModalOpcoes(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-modal overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-lg border-b border-creme-300">
              <p className="font-semibold text-on-surface">Conversa com {participante?.nome}</p>
            </div>
            {[
              { icone: 'person', label: 'Ver perfil', acao: () => { setModalOpcoes(false); navigate(`/perfil/${participante?.id}`) } },
              { icone: 'inventory_2', label: 'Ver item', acao: () => { setModalOpcoes(false); navigate(`/item/${itemConversa?.id}`) } },
              { icone: 'block', label: 'Bloquear usuário', acao: () => { setModalOpcoes(false); alert('Usuário bloqueado.') } },
              { icone: 'delete', label: 'Apagar conversa', acao: () => { setModalOpcoes(false); setConversaAtiva(null) }, cor: 'text-error' },
            ].map(({ icone, label, acao, cor }) => (
              <button key={label} onClick={acao}
                className="w-full flex items-center gap-md px-lg py-md hover:bg-creme-200 transition-colors text-left">
                <Icone nome={icone} className={cor || 'text-on-surface-muted'} />
                <span className={`font-medium text-sm ${cor || 'text-on-surface'}`}>{label}</span>
              </button>
            ))}
            <div className="p-md border-t border-creme-300">
              <button onClick={() => setModalOpcoes(false)} className="w-full text-on-surface-muted text-sm hover:text-on-surface py-sm">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
