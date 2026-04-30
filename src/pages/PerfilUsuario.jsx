import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Avatar, Icone } from '../components/ui'
import { usuarios, itens } from '../data/mock'

export default function PerfilUsuario() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { usuario, conversas } = useApp()

  const perfil = usuarios.find(u => u.id === id)
  if (!perfil) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-md">
      <p className="text-on-surface-variant">Usuário não encontrado.</p>
      <button onClick={() => navigate(-1)} className="btn-secondary">Voltar</button>
    </div>
  )

  const itensDoUsuario = itens.filter(i => i.doadorId === id && i.status === 'ativo')

  // Abre conversa existente com esse usuário, ou navega com state para criar
  function iniciarConversa() {
    const existente = conversas.find(c => c.participanteId === id)
    if (existente) {
      navigate('/mensagens', { state: { conversaId: existente.id } })
    } else {
      navigate('/mensagens', { state: { novaConversa: { participanteId: id, itemId: itensDoUsuario[0]?.id } } })
    }
  }

  function handleCompartilhar() {
    if (navigator.share) {
      navigator.share({ title: perfil.nome, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copiado!')
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-container flex items-center justify-between px-4 h-16 flex-shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-surface-container active:scale-95">
          <Icone nome="arrow_back" className="text-on-surface-variant" />
        </button>
        <span className="text-xl font-black text-primary">Doa aí</span>
        <div className="flex gap-1">
          <button onClick={handleCompartilhar} className="p-2 rounded-full hover:bg-surface-container active:scale-95">
            <Icone nome="share" className="text-on-surface-variant" />
          </button>
          <button onClick={() => navigate('/notificacoes')} className="p-2 rounded-full hover:bg-surface-container active:scale-95">
            <Icone nome="notifications" className="text-on-surface-variant" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-8">
        <div className="max-w-2xl mx-auto px-4 py-xl">
          {/* Card principal do perfil */}
          <div className="card p-xl mb-lg text-center">
            <div className="flex justify-center mb-md">
              <Avatar src={perfil.avatar} nome={perfil.nome} tamanho={96} />
            </div>
            <h1 className="text-h2 font-h2 text-on-surface mb-xs">{perfil.nome}</h1>
            <p className="text-on-surface-variant flex items-center justify-center gap-xs mb-md">
              <Icone nome="location_on" tamanho={16} />{perfil.cidade}
            </p>
            <div className="flex items-center justify-center gap-xs mb-lg">
              <Icone nome="star" tamanho={18} preenchido className="text-tertiary" />
              <span className="font-bold text-on-surface">{perfil.avaliacao}</span>
              <span className="text-on-surface-variant text-sm">• Avaliação média</span>
            </div>
            {/* Só mostra o botão se não for o próprio usuário */}
            {id !== usuario.id && (
              <button onClick={iniciarConversa} className="btn-primary w-full">
                <Icone nome="chat_bubble" />Enviar mensagem
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-md mb-xl">
            {[
              { valor: perfil.totalDoacoes || 12, label: 'Doações', icone: 'volunteer_activism', cor: 'text-primary' },
              { valor: perfil.itensRecebidos || 5, label: 'Recebidos', icone: 'archive', cor: 'text-secondary' },
              { valor: `${perfil.anosNaPlataforma || 2}a`, label: 'Na plataforma', icone: 'calendar_month', cor: 'text-tertiary' },
            ].map(({ valor, label, icone, cor }) => (
              <div key={label} className="card p-md text-center">
                <Icone nome={icone} tamanho={24} className={`${cor} mb-xs`} />
                <p className={`text-h3 font-h3 ${cor}`}>{valor}</p>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">{label}</p>
              </div>
            ))}
          </div>

          {/* Itens ativos */}
          <h2 className="text-h3 font-h3 text-on-surface mb-md">
            {itensDoUsuario.length > 0 ? 'Itens disponíveis' : 'Nenhum item disponível'}
          </h2>
          {itensDoUsuario.length === 0 ? (
            <div className="card p-xl text-center text-on-surface-variant">
              <Icone nome="inventory_2" tamanho={48} className="text-surface-container-highest mb-sm" />
              <p>Este usuário não tem itens disponíveis no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-md">
              {itensDoUsuario.map(item => (
                <button key={item.id} onClick={() => navigate(`/item/${item.id}`)}
                  className="card overflow-hidden flex gap-md text-left hover:shadow-modal transition-shadow active:scale-[0.99]">
                  <img src={item.fotos[0]} alt={item.titulo} className="w-28 h-28 object-cover flex-shrink-0" />
                  <div className="p-md flex-1 min-w-0">
                    <h3 className="font-semibold text-on-surface mb-xs truncate">{item.titulo}</h3>
                    <p className="text-sm text-on-surface-variant line-clamp-2 mb-sm">{item.descricao}</p>
                    <div className="flex items-center gap-sm">
                      <span className="chip bg-primary-fixed text-on-primary-fixed-variant capitalize text-xs">{item.categoria}</span>
                      <span className="text-xs text-on-surface-variant">{item.condicao}</span>
                    </div>
                    {item.distancia && item.distancia !== '0km' && (
                      <p className="text-xs text-primary mt-xs flex items-center gap-xs">
                        <Icone nome="location_on" tamanho={12} />{item.distancia} de você
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
