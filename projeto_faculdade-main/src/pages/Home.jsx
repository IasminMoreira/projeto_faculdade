import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { CardItem, Icone, Logo } from '../components/ui'
import { categorias, usuarios } from '../data/mock'

function normalizar(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
}

const S = {
  header: {
    position:'sticky', top:0, zIndex:40,
    background:'rgba(255,253,249,0.97)', backdropFilter:'blur(12px)',
    borderBottom:'1.5px solid #e5cfc0',
  },
  headerInner: {
    display:'flex', alignItems:'center', gap:12,
    padding:'0 16px', height:72, maxWidth:960, margin:'0 auto',
  },
  searchBox: {
    display:'flex', alignItems:'center', gap:8,
    background:'#fdf6ed', border:'2px solid #e5cfc0',
    borderRadius:9999, padding:'8px 16px', flex:1,
    transition:'border-color 0.15s, box-shadow 0.15s',
  },
  iconBtn: {
    background:'none', border:'none', cursor:'pointer',
    padding:8, borderRadius:12, display:'flex',
    color:'var(--text-muted)', transition:'background 0.15s',
  },
  hero: {
    background:'linear-gradient(135deg, #2a9470 0%, #154d3c 100%)',
    borderRadius:24, padding:'28px 28px', marginBottom:24,
    position:'relative', overflow:'hidden',
  },
  catBtn: (ativo) => ({
    width:56, height:56, borderRadius:16,
    display:'flex', alignItems:'center', justifyContent:'center',
    border: ativo ? 'none' : '2px solid #e5cfc0',
    background: ativo ? 'var(--coral)' : 'white',
    color: ativo ? 'white' : 'var(--text-muted)',
    cursor:'pointer', transition:'all 0.15s ease',
    boxShadow: ativo ? '0 4px 12px rgba(196,103,78,0.3)' : 'none',
  }),
  grid: {
    display:'grid', gap:16,
    gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))',
  },
}

export default function Home() {
  const navigate = useNavigate()
  const { itens, notificacoesNaoLidas } = useApp()
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos')
  const [busca, setBusca] = useState('')
  const [modalLocal, setModalLocal] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [localizacao, setLocalizacao] = useState('São Paulo, SP — Pinheiros')
  const [buscandoGps, setBuscandoGps] = useState(false)
  const [enderecoManual, setEnderecoManual] = useState('')
  const [modoManual, setModoManual] = useState(false)

  function usarGps() {
    if (!navigator.geolocation) {
      alert('Seu navegador não suporta geolocalização.')
      return
    }
    setBuscandoGps(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt`)
          .then(r => r.json())
          .then(data => {
            const bairro = data.address?.suburb || data.address?.neighbourhood || data.address?.city_district || ''
            const cidade = data.address?.city || data.address?.town || 'São Paulo'
            const estado = data.address?.state_code || 'SP'
            setLocalizacao(`${cidade}, ${estado}${bairro ? ' — ' + bairro : ''}`)
            setModalLocal(false)
            setBuscandoGps(false)
            setModoManual(false)
          })
          .catch(() => {
            setLocalizacao('Localização atual detectada')
            setModalLocal(false)
            setBuscandoGps(false)
          })
      },
      () => {
        setBuscandoGps(false)
        alert('Não foi possível obter sua localização. Verifique as permissões do navegador.')
      },
      { timeout: 10000 }
    )
  }

  function salvarEnderecoManual() {
    if (enderecoManual.trim()) {
      setLocalizacao(enderecoManual.trim())
      setModalLocal(false)
      setModoManual(false)
      setEnderecoManual('')
    }
  }

  const itensFiltrados = itens.filter(i => {
    if (i.status !== 'ativo') return false
    if (categoriaAtiva !== 'todos' && i.categoria !== categoriaAtiva) return false
    if (busca.trim()) {
      const q = normalizar(busca)
      return normalizar(i.titulo).includes(q) || normalizar(i.descricao).includes(q) || normalizar(i.categoria).includes(q)
    }
    return true
  })

  return (
    <div style={{ minHeight:'100vh', background:'var(--creme)' }}>
      {/* Header */}
      <header style={S.header}>
        <div style={S.headerInner}>
          <Logo height={72}/>
          <div style={{ flex:1, position:'relative' }}>
            <div style={{
              ...S.searchBox,
              borderColor: searchFocused ? 'var(--coral)' : '#e5cfc0',
              boxShadow: searchFocused ? '0 0 0 3px rgba(196,103,78,0.15)' : 'none',
            }}>
              <Icone nome="search" tamanho={18} style={{ color:'var(--text-muted)', flexShrink:0 }}/>
              <input
                style={{ flex:1, background:'transparent', border:'none', outline:'none',
                  fontSize:15, color:'var(--text)', fontFamily:'inherit' }}
                placeholder="Buscar doações..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              {busca && (
                <button onClick={() => setBusca('')} style={S.iconBtn}>
                  <Icone nome="close" tamanho={16}/>
                </button>
              )}
            </div>
          </div>
          <button onClick={() => setModalLocal(true)} style={S.iconBtn}>
            <Icone nome="location_on" style={{ color:'var(--verde)' }}/>
          </button>
          <button onClick={() => navigate('/notificacoes')}
            style={{ ...S.iconBtn, position:'relative' }}>
            <Icone nome="notifications"/>
            {notificacoesNaoLidas > 0 && (
              <span style={{ position:'absolute', top:6, right:6,
                width:10, height:10, background:'var(--coral)',
                borderRadius:'50%', border:'2px solid white' }}/>
            )}
          </button>
        </div>
      </header>

      <div style={{ maxWidth:960, margin:'0 auto', padding:'20px 16px 100px' }}>

        {/* Hero */}
        {!busca && categoriaAtiva === 'todos' && (
          <div style={S.hero}>
            {/* decoração */}
            <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180,
              borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
            <div style={{ position:'absolute', bottom:-30, left:'40%', width:120, height:120,
              borderRadius:'50%', background:'rgba(232,93,62,0.2)' }}/>
            <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', justifyContent:'space-between', gap:16 }}>
              <div>
                <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'4px 14px',
                  background:'rgba(255,255,255,0.18)', color:'white', borderRadius:9999,
                  fontSize:11, fontWeight:700, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:14 }}>
                  <Icone nome="volunteer_activism" tamanho={14}/>Comunidade ativa
                </span>
                <h2 style={{ fontSize:22, fontWeight:800, color:'white', margin:'0 0 12px', lineHeight:1.25, maxWidth:260 }}>
                  Doe o que não usa.<br/>Receba o que precisa.
                </h2>
                <button onClick={() => navigate('/anunciar')}
                  style={{ background:'var(--coral)', color:'white', border:'none',
                    padding:'10px 20px', borderRadius:9999, fontWeight:700, fontSize:14,
                    cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8,
                    boxShadow:'0 4px 12px rgba(196,103,78,0.4)', transition:'all 0.15s' }}>
                  Publicar doação
                  <Icone nome="arrow_forward" tamanho={18}/>
                </button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, flexShrink:0 }}>
                {[['25k+','Itens doados'],['10k+','Doadores'],['4.9★','Avaliação']].map(([n,l]) => (
                  <div key={l} style={{ background:'rgba(255,255,255,0.15)', borderRadius:14,
                    padding:'8px 16px', textAlign:'center', minWidth:100 }}>
                    <div style={{ color:'white', fontWeight:800, fontSize:16 }}>{n}</div>
                    <div style={{ color:'rgba(255,255,255,0.7)', fontSize:12 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Categorias */}
        <div style={{ display:'flex', gap:12, overflowX:'auto', paddingBottom:8, marginBottom:24, scrollbarWidth:'none' }}>
          {categorias.map(cat => (
            <div key={cat.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, flexShrink:0 }}>
              <button onClick={() => setCategoriaAtiva(cat.id)} style={S.catBtn(categoriaAtiva === cat.id)}>
                <Icone nome={cat.icone} tamanho={26}/>
              </button>
              <span style={{ fontSize:11, fontWeight:600,
                color: categoriaAtiva === cat.id ? 'var(--coral)' : 'var(--text-muted)' }}>
                {cat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Título */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:16 }}>
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:'var(--text)', margin:0 }}>
              {busca ? `Resultados para "${busca}"` : 'Próximo de você'}
            </h2>
            <p style={{ fontSize:13, color:'var(--text-muted)', margin:'2px 0 0' }}>
              {itensFiltrados.length} itens disponíveis
            </p>
          </div>
          <button style={{ background:'none', border:'none', cursor:'pointer',
            display:'flex', alignItems:'center', gap:4,
            color:'var(--verde)', fontWeight:600, fontSize:13 }}>
            Ver mapa<Icone nome="map" tamanho={16}/>
          </button>
        </div>

        {/* Grid */}
        {itensFiltrados.length === 0 ? (
          <div style={{ textAlign:'center', padding:'64px 0' }}>
            <div style={{ width:72, height:72, background:'#f8ece0', borderRadius:20,
              display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
              <Icone nome="search_off" tamanho={34} style={{ color:'var(--text-muted)' }}/>
            </div>
            <p style={{ fontSize:20, fontWeight:700, color:'var(--text)', margin:0 }}>Nenhum item encontrado</p>
            <p style={{ fontSize:14, color:'var(--text-muted)', marginTop:6 }}>Tente outra busca ou categoria</p>
          </div>
        ) : (
          <div style={S.grid}>
            {itensFiltrados.map(item => (
              <CardItem key={item.id} item={item}
                usuario={usuarios.find(u => u.id === item.doadorId)}
                onClick={() => navigate(`/item/${item.id}`)}/>
            ))}
          </div>
        )}
      </div>

      {/* Modal localização */}
      {modalLocal && (
        <div onClick={() => { setModalLocal(false); setModoManual(false) }} style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.45)',
          zIndex:50, display:'flex', alignItems:'flex-end', justifyContent:'center', padding:16,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background:'white', borderRadius:24, padding:28,
            width:'100%', maxWidth:420, boxShadow:'0 8px 48px rgba(0,0,0,0.2)',
          }}>
            <h3 style={{ fontSize:18, fontWeight:700, color:'var(--text)', margin:'0 0 6px' }}>
              Sua localização
            </h3>
            <p style={{ fontSize:13, color:'var(--text-muted)', margin:'0 0 20px' }}>
              Atual: <strong>{localizacao}</strong>
            </p>

            {!modoManual ? (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {/* GPS */}
                <button onClick={usarGps} disabled={buscandoGps}
                  style={{ padding:14, borderRadius:14, border:'2px solid #3d8068',
                    background:'#f0f9f4', color:'#3d8068',
                    display:'flex', alignItems:'center', gap:12,
                    cursor: buscandoGps ? 'not-allowed' : 'pointer',
                    fontWeight:600, fontSize:14, opacity: buscandoGps ? 0.7 : 1 }}>
                  {buscandoGps ? (
                    <div style={{ width:20, height:20, border:'2px solid #aadfc8',
                      borderTopColor:'#3d8068', borderRadius:'50%',
                      animation:'spin 0.8s linear infinite', flexShrink:0 }}/>
                  ) : (
                    <Icone nome="my_location" tamanho={20}/>
                  )}
                  {buscandoGps ? 'Buscando localização...' : 'Usar localização atual (GPS)'}
                </button>

                {/* Manual */}
                <button onClick={() => setModoManual(true)}
                  style={{ padding:14, borderRadius:14, border:'2px solid #e5cfc0',
                    background:'white', color:'var(--text)',
                    display:'flex', alignItems:'center', gap:12,
                    cursor:'pointer', fontWeight:600, fontSize:14 }}>
                  <Icone nome="edit_location" tamanho={20}/>
                  Digitar endereço manualmente
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <input
                  autoFocus
                  value={enderecoManual}
                  onChange={e => setEnderecoManual(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && salvarEnderecoManual()}
                  placeholder="Ex: Pinheiros, São Paulo"
                  style={{ width:'100%', padding:'12px 16px', fontSize:15,
                    border:'2px solid #c4674e', borderRadius:12, outline:'none',
                    fontFamily:'inherit', boxShadow:'0 0 0 3px rgba(196,103,78,0.15)' }}
                />
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={() => setModoManual(false)}
                    style={{ flex:1, padding:'11px 0', borderRadius:12, border:'2px solid #e5cfc0',
                      background:'white', cursor:'pointer', fontWeight:600, fontSize:14, fontFamily:'inherit' }}>
                    Voltar
                  </button>
                  <button onClick={salvarEnderecoManual}
                    style={{ flex:2, padding:'11px 0', borderRadius:12, border:'none',
                      background:'linear-gradient(135deg, #e85d3e, #c4674e)', color:'white',
                      cursor:'pointer', fontWeight:700, fontSize:14, fontFamily:'inherit' }}>
                    Confirmar
                  </button>
                </div>
              </div>
            )}

            <button onClick={() => { setModalLocal(false); setModoManual(false) }}
              style={{ width:'100%', marginTop:16, background:'none', border:'none',
                cursor:'pointer', color:'var(--text-muted)', fontSize:14, padding:'8px 0' }}>
              Cancelar
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        </div>
      )}
    </div>
  )
}
