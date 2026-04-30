import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icone, Avatar } from '../components/ui'
import { usuarios } from '../data/mock'

export default function DetalheItem() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { itens, conversas, usuario } = useApp()
  const [fotoAtiva, setFotoAtiva] = useState(0)

  const item = itens.find(i => i.id === id)
  if (!item) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-md">
      <p className="text-on-surface-variant">Item não encontrado.</p>
      <button onClick={() => navigate('/')} className="btn-secondary">Voltar ao início</button>
    </div>
  )

  const doador = usuarios.find(u => u.id === item.doadorId)
  const eMeuItem = item.doadorId === usuario.id

  function handleInteresse() {
    const existente = conversas.find(c => c.participanteId === item.doadorId && c.itemId === item.id)
    if (existente) {
      navigate('/mensagens', { state: { conversaId: existente.id } })
    } else {
      navigate('/mensagens', { state: { novaConversa: { participanteId: item.doadorId, itemId: item.id } } })
    }
  }

  function verPerfil() {
    if (eMeuItem) navigate('/perfil')
    else navigate(`/perfil/${doador.id}`)
  }

  function handleCompartilhar() {
    if (navigator.share) {
      navigator.share({ title: item.titulo, text: item.descricao, url: window.location.href })
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

      {/* Conteúdo com scroll, com padding no final para o botão fixo */}
      <div className="flex-1 overflow-y-auto pb-36">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-lg p-4">
          {/* Galeria */}
          <div>
            <div className="relative rounded-xl overflow-hidden bg-surface-container mb-sm">
              <img
                src={item.fotos[fotoAtiva]}
                alt={item.titulo}
                className="w-full h-72 md:h-96 object-cover"
              />
              <span className="absolute bottom-3 right-3 bg-inverse-surface/70 text-inverse-on-surface text-xs font-semibold px-sm py-xs rounded-full">
                {fotoAtiva + 1} / {item.fotos.length}
              </span>
            </div>
            {item.fotos.length > 1 && (
              <div className="grid grid-cols-4 gap-sm">
                {item.fotos.map((foto, i) => (
                  <button key={i} onClick={() => setFotoAtiva(i)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${i === fotoAtiva ? 'border-primary' : 'border-transparent'}`}>
                    <img src={foto} alt="" className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações */}
          <div className="space-y-md">
            <div className="card p-lg">
              <div className="flex items-center justify-between mb-sm">
                <span className="chip bg-primary-fixed text-on-primary-fixed-variant capitalize">{item.categoria}</span>
                <span className="text-xs text-on-surface-variant flex items-center gap-1">
                  <Icone nome="schedule" tamanho={14} />Há 2 horas
                </span>
              </div>
              <h1 className="text-h2 font-h2 text-on-surface mb-sm">{item.titulo}</h1>
              <span className="chip bg-surface-container text-on-surface-variant">Condição: {item.condicao}</span>
              <p className="text-body-md text-on-surface-variant mt-md leading-relaxed">{item.descricao}</p>
            </div>

            {/* Doador */}
            {doador && (
              <div className="card p-lg">
                <h3 className="text-label-md text-on-surface-variant uppercase tracking-wider mb-md">Doador</h3>
                <button onClick={verPerfil}
                  className="flex items-center gap-md mb-md w-full hover:bg-surface-container rounded-lg p-sm -mx-sm transition-colors text-left">
                  <Avatar src={doador.avatar} nome={doador.nome} tamanho={52} />
                  <div>
                    <p className="font-semibold text-on-surface">{doador.nome}</p>
                    <p className="text-sm text-on-surface-variant flex items-center gap-xs">
                      <Icone nome="location_on" tamanho={14} />Vila Mariana, São Paulo
                    </p>
                    <div className="flex items-center gap-xs mt-xs">
                      <Icone nome="star" tamanho={14} preenchido className="text-tertiary" />
                      <span className="text-sm font-semibold text-on-surface">{doador.avaliacao}</span>
                    </div>
                  </div>
                  <Icone nome="chevron_right" className="text-on-surface-variant ml-auto" />
                </button>
                <div className="grid grid-cols-2 gap-sm">
                  {[
                    { valor: doador.totalDoacoes || 12, label: 'Doações' },
                    { valor: `${doador.anosNaPlataforma || 3} anos`, label: 'Na plataforma' },
                  ].map(({ valor, label }) => (
                    <div key={label} className="bg-surface-container rounded-lg p-md text-center">
                      <p className="text-h3 font-h3 text-primary">{valor}</p>
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-variant">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Localização */}
            <div className="card p-lg">
              <h3 className="text-label-md text-on-surface-variant uppercase tracking-wider mb-md flex items-center gap-xs">
                <Icone nome="map" tamanho={18} />Localização aproximada
              </h3>
              <div className="rounded-lg h-36 bg-surface-container-high flex items-center justify-center">
                <div className="text-center text-on-surface-variant">
                  <Icone nome="location_on" tamanho={40} className="text-primary mb-xs" />
                  <p className="text-sm">Vila Mariana, São Paulo</p>
                  {item.distancia && item.distancia !== '0km' && (
                    <p className="text-xs mt-xs text-primary font-semibold">a {item.distancia} de você</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão fixo — esconde "Tenho Interesse" se for meu item */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-surface-container p-4 z-50 flex-shrink-0">
        <div className="max-w-5xl mx-auto">
          {eMeuItem ? (
            <div className="flex gap-md">
              <button
                onClick={() => navigate('/meus-anuncios')}
                className="btn-secondary flex-1 py-md"
              >
                <Icone nome="edit" />Gerenciar anúncio
              </button>
              <button
                onClick={() => navigate('/mensagens')}
                className="btn-outline flex-1 py-md"
              >
                <Icone nome="chat_bubble" />Ver mensagens
              </button>
            </div>
          ) : (
            <>
              <button onClick={handleInteresse} className="btn-primary w-full text-body-lg py-lg">
                <Icone nome="chat_bubble" />Tenho Interesse
              </button>
              <p className="text-center text-xs text-on-surface-variant mt-sm flex items-center justify-center gap-xs">
                <Icone nome="info" tamanho={14} />
                A entrega é combinada entre as partes. O Doa aí não se responsabiliza pela logística.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
