import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icone, Avatar, Logo } from '../components/ui'
import { usuarios } from '../data/mock'

const coresIcone = {
  primary:  'bg-verde-100 text-verde-700',
  secondary:'bg-coral-100 text-coral-700',
  tertiary: 'bg-coral-200 text-coral-800',
  outline:  'bg-creme-200 text-on-surface-muted',
}

export default function Notificacoes() {
  const navigate = useNavigate()
  const { notificacoes, marcarNotificacaoLida, marcarTodasLidas } = useApp()

  const recentes   = notificacoes.filter(n => !n.lida)
  const anteriores = notificacoes.filter(n => n.lida)

  return (
    <div className="min-h-screen" style={{ background: '#fffdf9' }}>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-creme-300 flex items-center justify-between px-md h-16">
        <div className="flex items-center gap-md">
          <button onClick={() => navigate(-1)} className="p-sm rounded-xl hover:bg-creme-200 active:scale-95">
            <Icone nome="arrow_back" className="text-on-surface-muted"/>
          </button>
          <Logo height={72}/>
        </div>
        {recentes.length > 0 && (
          <button onClick={marcarTodasLidas}
            className="text-sm font-semibold text-coral-600 hover:underline px-md py-sm rounded-xl hover:bg-coral-50 transition-colors">
            Marcar todas como lidas
          </button>
        )}
      </header>

      <main className="max-w-2xl mx-auto px-md py-xl pb-32">
        <div className="mb-xl">
          <h1 className="text-h1 font-bold text-on-surface">Notificações</h1>
          <p className="text-body text-on-surface-muted mt-xs">Acompanhe as novidades da sua rede.</p>
        </div>

        {recentes.length > 0 && (
          <section className="mb-xl">
            <div className="flex items-center gap-sm mb-md">
              <h2 className="text-h4 font-bold text-on-surface">Recentes</h2>
              <span className="badge-coral">{recentes.length}</span>
            </div>
            <div className="space-y-sm">
              {recentes.map(n => (
                <NotifCard key={n.id} n={n} onLida={() => marcarNotificacaoLida(n.id)}/>
              ))}
            </div>
          </section>
        )}

        {anteriores.length > 0 && (
          <section>
            <h2 className="text-h4 font-bold text-on-surface-muted mb-md">Anteriores</h2>
            <div className="space-y-sm opacity-70">
              {anteriores.map(n => (
                <NotifCard key={n.id} n={n} lida/>
              ))}
            </div>
          </section>
        )}

        {notificacoes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-xxl text-center">
            <div className="w-20 h-20 bg-creme-200 rounded-2xl flex items-center justify-center mb-lg">
              <Icone nome="notifications_off" tamanho={36} className="text-on-surface-muted"/>
            </div>
            <p className="text-h3 font-bold text-on-surface">Tudo em dia!</p>
          </div>
        )}
      </main>
    </div>
  )
}

function NotifCard({ n, lida = false, onLida }) {
  const navigate = useNavigate()
  const cor = coresIcone[n.cor] || coresIcone.outline
  const u = n.avatarId ? usuarios.find(x => x.id === n.avatarId) : null

  return (
    <div onClick={onLida}
      className={`rounded-xl border-2 flex gap-md items-start p-md cursor-pointer transition-all hover:shadow-soft active:scale-[0.99]
        ${lida ? 'bg-white border-creme-200' : 'bg-coral-50 border-coral-200'}`}>
      {u ? (
        <div className="relative flex-shrink-0">
          <Avatar src={u.avatar} nome={u.nome} tamanho={48}/>
          <div className={`absolute -bottom-1 -right-1 p-xs rounded-pill border-2 border-white ${cor}`}>
            <Icone nome={n.icone} tamanho={12} preenchido/>
          </div>
        </div>
      ) : (
        <div className={`p-sm rounded-xl flex-shrink-0 ${cor}`}>
          <Icone nome={n.icone} tamanho={22}/>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-xs">
          <span className={`text-label font-bold uppercase tracking-wider ${lida ? 'text-on-surface-muted' : 'text-coral-700'}`}>
            {n.titulo}
          </span>
          <span className="text-xs text-on-surface-muted flex-shrink-0 ml-sm">{n.tempo}</span>
        </div>
        <p className="text-sm text-on-surface"
          dangerouslySetInnerHTML={{ __html: n.mensagem.replace(/"([^"]+)"/g, '<strong>"$1"</strong>') }}/>
        {n.acoes && (
          <div className="flex gap-sm mt-sm">
            <button onClick={e => { e.stopPropagation(); navigate('/perfil') }}
              className="bg-verde-600 text-white text-xs font-bold px-md py-xs rounded-pill hover:brightness-110 active:scale-95">
              Ver Perfil
            </button>
            <button onClick={e => { e.stopPropagation(); navigate('/mensagens') }}
              className="border-2 border-creme-300 text-on-surface text-xs font-bold px-md py-xs rounded-pill hover:bg-creme-100 active:scale-95">
              Responder
            </button>
          </div>
        )}
      </div>
      {!lida && <div className="w-2.5 h-2.5 bg-coral-500 rounded-pill flex-shrink-0 mt-sm"/>}
    </div>
  )
}
