import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icone, Logo } from '../components/ui'
import { categorias } from '../data/mock'

const condicoes = ['Novo', 'Bom estado', 'Usado']

export default function Anunciar() {
  const navigate = useNavigate()
  const { adicionarItem } = useApp()
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [categoria, setCategoria] = useState('')
  const [condicao, setCondicao] = useState('Bom estado')
  const [fotos, setFotos] = useState([])
  const [localizacao, setLocalizacao] = useState('São Paulo, SP — Pinheiros')
  const [editandoLocal, setEditandoLocal] = useState(false)
  const [localTemp, setLocalTemp] = useState('')
  const [buscandoGps, setBuscandoGps] = useState(false)
  const inputRef = useRef(null)

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

  function usarGps() {
    setBuscandoGps(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocalizacao('São Paulo, SP — Localização atual')
          setBuscandoGps(false)
          setEditandoLocal(false)
        },
        () => {
          setLocalizacao('São Paulo, SP — Pinheiros')
          setBuscandoGps(false)
          setEditandoLocal(false)
        }
      )
    } else {
      setBuscandoGps(false)
    }
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

          {/* Localização — botões funcionando */}
          <section className="card p-lg">
            <h3 className="text-h3 font-h3 text-on-surface mb-md flex items-center gap-sm">
              <Icone nome="location_on" className="text-verde-600" />Onde está o item?
            </h3>

            {editandoLocal ? (
              <div className="space-y-sm">
                <input
                  className="input"
                  placeholder="Digite o bairro ou cidade"
                  value={localTemp}
                  onChange={e => setLocalTemp(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-sm">
                  <button type="button" onClick={usarGps} disabled={buscandoGps}
                    className="flex-1 flex items-center justify-center gap-sm p-md rounded-xl border border-primary bg-coral-50/20 text-verde-600 font-semibold text-sm hover:bg-coral-50 transition-colors disabled:opacity-50">
                    <Icone nome="my_location" tamanho={18} />
                    {buscandoGps ? 'Buscando...' : 'Usar GPS'}
                  </button>
                  <button type="button" onClick={salvarLocal}
                    className="flex-1 flex items-center justify-center gap-sm p-md rounded-xl bg-primary text-on-primary font-semibold text-sm hover:brightness-110 transition-colors">
                    <Icone nome="check" tamanho={18} />Confirmar
                  </button>
                </div>
                <button type="button" onClick={() => setEditandoLocal(false)}
                  className="w-full text-on-surface-muted text-sm hover:text-on-surface py-sm">Cancelar</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-md p-md bg-creme-100 rounded-lg border border-creme-300 mb-md">
                  <div className="bg-primary-container p-sm rounded-full flex-shrink-0">
                    <Icone nome="my_location" className="text-on-primary-container" />
                  </div>
                  <div className="flex-1">
                    <p className="text-label-md text-on-surface">Localização atual</p>
                    <p className="text-xs text-on-surface-muted">{localizacao}</p>
                  </div>
                  <button type="button" onClick={() => { setEditandoLocal(true); setLocalTemp(localizacao) }}
                    className="text-coral-600 text-label-md hover:underline active:scale-95">Alterar</button>
                </div>
                <div className="h-36 rounded-xl bg-creme-200 flex items-center justify-center border border-creme-300">
                  <div className="text-center text-on-surface-muted">
                    <Icone nome="map" tamanho={40} className="text-outline mb-xs" />
                    <p className="text-sm">{localizacao}</p>
                  </div>
                </div>
              </>
            )}
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
