import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CardItem, Icone } from '../components/ui'
import { categorias, usuarios } from '../data/mock'

// Remove acentos para busca sem acento funcionar
function normalizar(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export default function Home() {
  const navigate = useNavigate()
  const { itens, notificacoesNaoLidas } = useApp()
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos')
  const [busca, setBusca] = useState('')
  const [modalLocalizacao, setModalLocalizacao] = useState(false)
  const [modalMapa, setModalMapa] = useState(false)

  const itensFiltrados = itens.filter(i => {
    if (i.status !== 'ativo') return false
    if (categoriaAtiva !== 'todos' && i.categoria !== categoriaAtiva) return false
    if (busca.trim()) {
      const q = normalizar(busca)
      return normalizar(i.titulo).includes(q) || normalizar(i.descricao).includes(q) || normalizar(i.categoria).includes(q)
    }
    return true
  })

  function getUsuario(id) { return usuarios.find(u => u.id === id) }

  function handleLocalizacao() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setModalLocalizacao(true),
        () => setModalLocalizacao(true)
      )
    } else {
      setModalLocalizacao(true)
    }
  }

  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-container shadow-sm">
        <div className="flex items-center gap-3 px-4 h-16 max-w-5xl mx-auto">
          <span className="text-2xl font-black text-primary tracking-tight cursor-pointer" onClick={() => navigate('/')}>Doa aí</span>
          <div className="flex-1 mx-2">
            <div className="flex items-center gap-2 bg-surface-container-low rounded-full px-4 py-2">
              <Icone nome="search" tamanho={20} className="text-outline" />
              <input
                className="flex-1 bg-transparent outline-none text-body-md text-on-surface placeholder:text-outline"
                placeholder="Buscar doações..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
              {busca && (
                <button onClick={() => setBusca('')} className="active:scale-95">
                  <Icone nome="close" tamanho={18} className="text-outline" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={handleLocalizacao}
            className="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95"
            title="Minha localização">
            <Icone nome="location_on" className="text-on-surface-variant" />
          </button>
          <button
            onClick={() => navigate('/notificacoes')}
            className="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95 relative"
            title="Notificações">
            <Icone nome="notifications" className="text-on-surface-variant" />
            {notificacoesNaoLidas > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary rounded-full" />
            )}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-lg">
        {/* Categorias */}
        <div className="flex gap-sm overflow-x-auto pb-sm scrollbar-none mb-lg">
          {categorias.map(cat => (
            <div key={cat.id} className="flex flex-col items-center gap-xs flex-shrink-0">
              <button
                onClick={() => setCategoriaAtiva(cat.id)}
                className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all active:scale-90
                  ${categoriaAtiva === cat.id
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-lowest border border-surface-container-high text-on-surface-variant hover:bg-surface-container'
                  }`}>
                <Icone nome={cat.icone} tamanho={26} />
              </button>
              <span className={`text-[11px] font-semibold ${categoriaAtiva === cat.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                {cat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-md">
          <h2 className="text-h3 font-h3 text-on-surface">
            {busca ? `Resultados para "${busca}"` : 'Próximo de você'}
          </h2>
          <button
            onClick={() => setModalMapa(true)}
            className="flex items-center gap-xs text-secondary text-label-md hover:underline active:scale-95">
            Ver mapa
            <Icone nome="map" tamanho={18} />
          </button>
        </div>

        {/* Grid */}
        {itensFiltrados.length === 0 ? (
          <div className="text-center py-xxl text-on-surface-variant">
            <Icone nome="search_off" tamanho={64} className="text-surface-container-highest mb-md" />
            <p className="text-h3 font-h3">Nenhum item encontrado</p>
            <p className="text-body-md mt-xs">Tente outra busca ou categoria</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
            {itensFiltrados.map(item => (
              <CardItem
                key={item.id}
                item={item}
                usuario={getUsuario(item.doadorId)}
                onClick={() => navigate(`/item/${item.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Localização */}
      {modalLocalizacao && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4" onClick={() => setModalLocalizacao(false)}>
          <div className="bg-white rounded-2xl p-xl w-full max-w-sm shadow-modal" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-md mb-lg">
              <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center">
                <Icone nome="location_on" tamanho={28} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-on-surface">Sua localização</h3>
                <p className="text-sm text-on-surface-variant">São Paulo, SP — Pinheiros</p>
              </div>
            </div>
            <div className="space-y-sm">
              {['Usar localização atual', 'Digitar endereço manualmente'].map((op, i) => (
                <button key={op}
                  onClick={() => setModalLocalizacao(false)}
                  className={`w-full p-md rounded-xl border text-left flex items-center gap-md transition-colors
                    ${i === 0 ? 'border-primary bg-primary-fixed/20 text-primary' : 'border-surface-container hover:bg-surface-container text-on-surface'}`}>
                  <Icone nome={i === 0 ? 'my_location' : 'edit_location'} tamanho={20} />
                  <span className="font-semibold text-sm">{op}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setModalLocalizacao(false)} className="w-full mt-md text-on-surface-variant text-sm hover:text-on-surface">Cancelar</button>
          </div>
        </div>
      )}

      {/* Modal Mapa */}
      {modalMapa && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setModalMapa(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-modal overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-lg border-b border-surface-container">
              <h3 className="font-semibold text-on-surface">Itens no mapa</h3>
              <button onClick={() => setModalMapa(false)} className="p-1 rounded-full hover:bg-surface-container">
                <Icone nome="close" className="text-on-surface-variant" />
              </button>
            </div>
            <div className="h-64 bg-surface-container-high flex flex-col items-center justify-center text-on-surface-variant">
              <Icone nome="map" tamanho={64} className="text-outline mb-md" />
              <p className="font-semibold">Mapa em breve</p>
              <p className="text-sm mt-xs text-center px-lg">A visualização no mapa será disponibilizada em uma próxima versão.</p>
            </div>
            <div className="p-lg">
              <p className="text-sm text-on-surface-variant text-center">
                {itensFiltrados.length} itens disponíveis na sua região
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
