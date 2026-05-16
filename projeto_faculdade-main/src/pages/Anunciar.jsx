import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icone, Logo } from '../components/ui'
import { categorias } from '../data/mock'

const condicoes = ['Novo', 'Bom estado', 'Usado']

// ── Componente de mapa (Leaflet + OpenStreetMap, sem API key) ─────────────────
function MapaLocalizacao({ lat, lng, onPosicaoAlterada }) {
  const mapaRef    = useRef(null)
  const leafletRef = useRef(null)
  const marcadorRef= useRef(null)

  useEffect(() => {
    // Carrega o CSS do Leaflet dinamicamente
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id   = 'leaflet-css'
      link.rel  = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Carrega o JS do Leaflet dinamicamente
    function iniciarMapa(L) {
      if (leafletRef.current) return // já iniciado

      const mapa = L.map(mapaRef.current, { zoomControl: true }).setView([lat, lng], 15)
      leafletRef.current = mapa

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapa)

      // Ícone customizado na cor do projeto
      const icone = L.divIcon({
        className: '',
        html: `<div style="
          width:36px;height:36px;border-radius:50% 50% 50% 0;
          background:linear-gradient(135deg,#e85d3e,#c4674e);
          border:3px solid white;
          box-shadow:0 2px 8px rgba(0,0,0,0.35);
          transform:rotate(-45deg);
        "></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      })

      const marcador = L.marker([lat, lng], { icon: icone, draggable: true }).addTo(mapa)
      marcadorRef.current = marcador

      // Ao arrastar o marcador atualiza a localização
      marcador.on('dragend', async (e) => {
        const { lat: novaLat, lng: novaLng } = e.target.getLatLng()
        const endereco = await reverseGeocode(novaLat, novaLng)
        onPosicaoAlterada(novaLat, novaLng, endereco)
      })

      // Ao clicar no mapa move o marcador
      mapa.on('click', async (e) => {
        const { lat: novaLat, lng: novaLng } = e.latlng
        marcador.setLatLng([novaLat, novaLng])
        const endereco = await reverseGeocode(novaLat, novaLng)
        onPosicaoAlterada(novaLat, novaLng, endereco)
      })
    }

    if (window.L) {
      iniciarMapa(window.L)
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => iniciarMapa(window.L)
      document.head.appendChild(script)
    }

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove()
        leafletRef.current = null
      }
    }
  }, [])

  // Atualiza posição do marcador quando lat/lng mudam externamente (GPS)
  useEffect(() => {
    if (leafletRef.current && marcadorRef.current) {
      marcadorRef.current.setLatLng([lat, lng])
      leafletRef.current.setView([lat, lng], 15)
    }
  }, [lat, lng])

  return (
    <div
      ref={mapaRef}
      style={{ height: 220, borderRadius: 12, overflow: 'hidden', zIndex: 0 }}
    />
  )
}

// ── Reverse geocoding via Nominatim (OpenStreetMap, gratuito) ─────────────────
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=pt-BR`
    )
    const data = await res.json()
    const { road, suburb, city, town, state } = data.address || {}
    const partes = [road || suburb, suburb !== road ? suburb : null, city || town, state]
      .filter(Boolean)
    return partes.slice(0, 3).join(', ')
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Anunciar() {
  const navigate = useNavigate()
  const { adicionarItem } = useApp()
  const [titulo, setTitulo]         = useState('')
  const [descricao, setDescricao]   = useState('')
  const [categoria, setCategoria]   = useState('')
  const [condicao, setCondicao]     = useState('Bom estado')
  const [fotos, setFotos]           = useState([])
  const [localizacao, setLocalizacao] = useState('São Paulo, SP')
  const [editandoLocal, setEditandoLocal] = useState(false)
  const [localTemp, setLocalTemp]   = useState('')
  const [buscandoGps, setBuscandoGps] = useState(false)
  const [lat, setLat] = useState(-23.5505)   // São Paulo como padrão
  const [lng, setLng] = useState(-46.6333)
  const inputRef = useRef(null)

  // Tenta pegar GPS ao abrir a página
  useEffect(() => {
    usarGps()
  }, [])

  function handleFotos(e) {
    const arquivos = Array.from(e.target.files)
    arquivos.forEach(arquivo => {
      const reader = new FileReader()
      reader.onload = ev => {
        setFotos(prev => prev.length < 4 ? [...prev, ev.target.result] : prev)
      }
      reader.readAsDataURL(arquivo)
    })
  }

  function removerFoto(idx) {
    setFotos(prev => prev.filter((_, i) => i !== idx))
  }

  async function usarGps() {
    if (!navigator.geolocation) return
    setBuscandoGps(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const novaLat = pos.coords.latitude
        const novaLng = pos.coords.longitude
        setLat(novaLat)
        setLng(novaLng)
        const endereco = await reverseGeocode(novaLat, novaLng)
        setLocalizacao(endereco)
        setBuscandoGps(false)
        setEditandoLocal(false)
      },
      () => {
        setBuscandoGps(false)
      }
    )
  }

  function handlePosicaoAlterada(novaLat, novaLng, endereco) {
    setLat(novaLat)
    setLng(novaLng)
    setLocalizacao(endereco)
  }

  function salvarLocal() {
    if (localTemp.trim()) setLocalizacao(localTemp.trim())
    setEditandoLocal(false)
    setLocalTemp('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!titulo.trim()) return
    adicionarItem({
      titulo,
      descricao,
      categoria: categoria || 'moveis',
      condicao,
      localizacao,
      lat,
      lng,
      fotos: fotos.length > 0 ? fotos : ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80'],
      distancia: '0km',
      publicadoEm: new Date().toISOString().split('T')[0],
    })
    navigate('/meus-anuncios')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-creme-300 flex items-center justify-between px-4 h-16">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-creme-200 active:scale-95">
          <Icone nome="arrow_back" className="text-on-surface-muted" />
        </button>
        <Logo height={72}/>
        <button onClick={() => navigate('/notificacoes')} className="p-2 rounded-full hover:bg-creme-200 active:scale-95">
          <Icone nome="notifications" className="text-on-surface-muted" />
        </button>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-xl pb-32">
        <div className="text-center mb-xxl">
          <h1 className="text-h1 font-h1 text-verde-600 mb-sm">Criar novo anúncio</h1>
          <p className="text-body-lg text-on-surface-muted">
            Sua doação pode fazer o dia de alguém melhor.<br />Compartilhe o que você não usa mais.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-xl">
          {/* Fotos */}
          <section className="card p-lg">
            <h3 className="text-h3 font-h3 text-on-surface mb-md flex items-center gap-sm">
              <Icone nome="add_a_photo" className="text-verde-600" />Fotos do item
            </h3>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFotos} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
              {fotos.length < 4 && (
                <button type="button" onClick={() => inputRef.current.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-outline-variant bg-creme-100 flex flex-col items-center justify-center cursor-pointer hover:bg-creme-200 transition-colors group">
                  <Icone nome="upload" tamanho={32} className="text-verde-600 group-hover:scale-110 transition-transform" />
                  <span className="text-label-md text-on-surface-muted mt-sm">Adicionar</span>
                </button>
              )}
              {fotos.map((foto, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden relative border border-creme-300">
                  <img src={foto} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removerFoto(i)}
                    className="absolute top-1 right-1 bg-error text-on-error rounded-full w-6 h-6 flex items-center justify-center shadow active:scale-95">
                    <Icone nome="close" tamanho={14} />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-inverse-surface/70 text-inverse-on-surface text-[10px] font-bold px-xs py-xs rounded">Principal</span>
                  )}
                </div>
              ))}
              {Array.from({ length: Math.max(0, 3 - fotos.length) }).map((_, i) => (
                <div key={`v${i}`} className="aspect-square rounded-xl bg-creme-100 border border-creme-300" />
              ))}
            </div>
            <p className="text-label-md text-on-surface-muted mt-md">Dica: Fotos claras ajudam a encontrar um novo dono mais rápido. Máximo 4 fotos.</p>
          </section>

          {/* Detalhes */}
          <section className="card p-lg space-y-lg">
            <h3 className="text-h3 font-h3 text-on-surface">Detalhes do item</h3>
            <div className="space-y-xs">
              <label className="block text-label-md text-on-surface-muted">Título do anúncio *</label>
              <input className="input" placeholder="Ex: Cadeira de balanço em madeira"
                value={titulo} onChange={e => setTitulo(e.target.value)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="space-y-xs">
                <label className="block text-label-md text-on-surface-muted">Categoria</label>
                <div className="relative">
                  <select className="input appearance-none pr-10" value={categoria} onChange={e => setCategoria(e.target.value)}>
                    <option value="">Selecionar...</option>
                    {categorias.filter(c => c.id !== 'todos').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <Icone nome="expand_more" className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted pointer-events-none" />
                </div>
              </div>
              <div className="space-y-xs">
                <label className="block text-label-md text-on-surface-muted">Condição</label>
                <div className="flex flex-wrap gap-sm">
                  {condicoes.map(c => (
                    <button key={c} type="button" onClick={() => setCondicao(c)}
                      className={`px-md py-sm rounded-full border text-label-md transition-all
                        ${condicao === c ? 'border-primary bg-coral-50 text-on-primary-fixed-variant' : 'border-outline-variant text-on-surface-muted hover:border-primary'}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-xs">
              <label className="block text-label-md text-on-surface-muted">Descrição</label>
              <textarea className="input h-auto py-md" rows={4}
                placeholder="Conte mais sobre o item, dimensões e por que está doando..."
                value={descricao} onChange={e => setDescricao(e.target.value)} />
            </div>
          </section>

          {/* Localização com mapa real */}
          <section className="card p-lg">
            <h3 className="text-h3 font-h3 text-on-surface mb-md flex items-center gap-sm">
              <Icone nome="location_on" className="text-verde-600" />Onde está o item?
            </h3>

            {/* Barra de localização */}
            <div className="flex items-center gap-md p-md bg-creme-100 rounded-lg border border-creme-300 mb-md">
              <div className="bg-primary-container p-sm rounded-full flex-shrink-0">
                <Icone nome="my_location" className="text-on-primary-container" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-label-md text-on-surface">Localização</p>
                <p className="text-xs text-on-surface-muted truncate">{buscandoGps ? 'Buscando localização...' : localizacao}</p>
              </div>
              <button type="button" onClick={usarGps} disabled={buscandoGps}
                className="text-coral-600 text-label-md hover:underline active:scale-95 flex items-center gap-xs flex-shrink-0 disabled:opacity-50">
                {buscandoGps
                  ? <><Icone nome="sync" tamanho={14} className="animate-spin" />Buscando</>
                  : <><Icone nome="gps_fixed" tamanho={14} />GPS</>}
              </button>
            </div>

            {/* Campo de texto manual */}
            {editandoLocal ? (
              <div className="flex gap-sm mb-md">
                <input
                  className="input flex-1"
                  placeholder="Digite o bairro ou cidade"
                  value={localTemp}
                  onChange={e => setLocalTemp(e.target.value)}
                  autoFocus
                />
                <button type="button" onClick={salvarLocal}
                  className="px-md py-sm rounded-xl bg-primary text-on-primary font-semibold text-sm">
                  OK
                </button>
                <button type="button" onClick={() => setEditandoLocal(false)}
                  className="px-md py-sm rounded-xl border border-outline-variant text-on-surface-muted text-sm">
                  ✕
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => { setEditandoLocal(true); setLocalTemp(localizacao) }}
                className="text-xs text-coral-600 hover:underline mb-md flex items-center gap-xs">
                <Icone nome="edit" tamanho={13} />Digitar endereço manualmente
              </button>
            )}

            {/* Mapa real Leaflet */}
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #e5cfc0' }}>
              <MapaLocalizacao lat={lat} lng={lng} onPosicaoAlterada={handlePosicaoAlterada} />
            </div>
            <p className="text-xs text-on-surface-muted mt-sm flex items-center gap-xs">
              <Icone nome="info" tamanho={12} />
              Arraste o marcador ou clique no mapa para ajustar a localização exata.
            </p>
          </section>

          <div className="pt-lg">
            <button type="submit" disabled={!titulo.trim()}
              className="btn-verde w-full text-body-lg py-lg disabled:opacity-50">
              Publicar Doação<Icone nome="send" />
            </button>
            <p className="text-center text-label-md text-on-surface-muted mt-md flex items-center justify-center gap-xs">
              <Icone nome="verified_user" tamanho={14} />Seu anúncio será revisado em breve
            </p>
          </div>
        </form>
      </main>
    </div>
  )
}
