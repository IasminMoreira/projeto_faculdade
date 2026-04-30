import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import TopBar from '../components/layout/TopBar'
import { Icone, Avatar } from '../components/ui'
import { usuarios } from '../data/mock'

const coresBadge = {
  primary:  'bg-primary-container text-on-primary-container',
  secondary:'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
  outline:  'bg-surface-container-highest text-on-surface-variant',
}

export default function Notificacoes() {
  const navigate = useNavigate()
  const { notificacoes, marcarNotificacaoLida, marcarTodasLidas } = useApp()

  const recentes   = notificacoes.filter(n => !n.lida)
  const anteriores = notificacoes.filter(n => n.lida)

  return (
    <div>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-container flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-md">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-surface-container active:scale-95">
            <Icone nome="arrow_back" className="text-on-surface-variant" />
          </button>
          <span className="text-xl font-black text-primary">Doa aí</span>
        </div>
        <div className="flex gap-1">
          <button className="p-2 rounded-full hover:bg-surface-container">
            <Icone nome="location_on" className="text-on-surface-variant" />
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container">
            <Icone nome="notifications" preenchido className="text-primary" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-xl pb-32">
        {/* Título */}
        <div className="flex items-end justify-between mb-xl">
          <div>
            <h1 className="text-h1 font-h1 text-on-surface">Notificações</h1>
            <p className="text-body-md text-on-surface-variant mt-xs">
              Acompanhe as novidades da sua rede de solidariedade.
            </p>
          </div>
          {recentes.length > 0 && (
            <button
              onClick={marcarTodasLidas}
              className="text-label-md text-primary hover:underline px-md py-sm rounded-full hover:bg-primary-fixed transition-colors"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>

        {/* Recentes */}
        {recentes.length > 0 && (
          <section className="mb-xl">
            <h2 className="text-h3 font-h3 mb-md flex items-center gap-sm">
              Recentes
              <span className="bg-primary text-on-primary text-xs px-sm py-xs rounded-full font-bold">
                {recentes.length}
              </span>
            </h2>
            <div className="space-y-sm">
              {recentes.map(n => (
                <NotificacaoCard key={n.id} notif={n} onLida={() => marcarNotificacaoLida(n.id)} />
              ))}
            </div>
          </section>
        )}

        {/* Anteriores */}
        {anteriores.length > 0 && (
          <section>
            <h2 className="text-h3 font-h3 text-on-surface-variant mb-md">Anteriores</h2>
            <div className="space-y-sm opacity-80">
              {anteriores.map(n => (
                <NotificacaoCard key={n.id} notif={n} lida />
              ))}
            </div>
          </section>
        )}

        {notificacoes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-xxl text-center">
            <Icone nome="notifications_off" tamanho={64} className="text-surface-container-highest mb-md" />
            <p className="text-h3 font-h3 text-on-surface-variant">Tudo limpo por aqui!</p>
          </div>
        )}
      </main>
    </div>
  )
}

function NotificacaoCard({ notif, lida = false, onLida }) {
  const navigate = useNavigate()
  const corIcone = coresBadge[notif.cor] || coresBadge.outline
  const usuario = notif.avatarId ? usuarios.find(u => u.id === notif.avatarId) : null

  return (
    <div
      onClick={onLida}
      className={`p-md rounded-xl border flex gap-md items-start cursor-pointer transition-shadow hover:shadow-card
        ${lida
          ? 'bg-surface-container-lowest border-surface-container'
          : 'bg-primary-fixed/10 border-primary-fixed-dim/50 shadow-sm'
        }`}
    >
      {/* Ícone ou avatar */}
      {usuario ? (
        <div className="relative flex-shrink-0">
          <Avatar src={usuario.avatar} nome={usuario.nome} tamanho={48} />
          <div className={`absolute -bottom-1 -right-1 p-xs rounded-full border-2 border-white ${corIcone}`}>
            <Icone nome={notif.icone} tamanho={14} preenchido />
          </div>
        </div>
      ) : (
        <div className={`p-sm rounded-full flex-shrink-0 ${corIcone}`}>
          <Icone nome={notif.icone} tamanho={22} />
        </div>
      )}

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-xs">
          <span className={`text-label-md font-bold ${lida ? 'text-on-surface-variant' : `text-${notif.cor}`}`}>
            {notif.titulo}
          </span>
          <span className="text-xs text-on-surface-variant flex-shrink-0 ml-sm">{notif.tempo}</span>
        </div>
        <p className="text-body-md text-on-surface"
          dangerouslySetInnerHTML={{ __html: notif.mensagem.replace(/"([^"]+)"/g, '<strong>"$1"</strong>') }}
        />

        {/* Ações */}
        {notif.acoes && (
          <div className="flex gap-sm mt-sm">
            <button
              onClick={e => { e.stopPropagation(); navigate('/perfil') }}
              className="bg-primary text-on-primary text-sm font-semibold px-md py-xs rounded-lg hover:brightness-110 active:scale-95 transition-all"
            >
              Ver Perfil
            </button>
            <button
              onClick={e => { e.stopPropagation(); navigate('/mensagens') }}
              className="bg-surface-container-lowest border border-outline text-on-surface text-sm font-semibold px-md py-xs rounded-lg hover:bg-surface-container transition-all active:scale-95"
            >
              Responder
            </button>
          </div>
        )}
      </div>

      {/* Indicador não lida */}
      {!lida && (
        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
      )}
    </div>
  )
}
