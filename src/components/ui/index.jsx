import logoImg from '../../assets/logo.png'

// ── Ícone Material ──────────────────────────────────────────────────────────
export function Icone({ nome, preenchido = false, tamanho = 24, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: tamanho,
        fontVariationSettings: preenchido
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}>
      {nome}
    </span>
  )
}

// ── Logo (imagem real) ────────────────────────────────────────────────────────
export function Logo({ height = 40, className = '' }) {
  return (
    <img src={logoImg} alt="Doa aí" height={height}
      style={{ height, width: 'auto', objectFit: 'contain' }}
      className={className}/>
  )
}

// ── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ src, nome, tamanho = 40 }) {
  return (
    <img
      src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(nome || 'U')}&background=ffc9b8&color=a04030`}
      alt={nome}
      style={{ width: tamanho, height: tamanho, flexShrink: 0, borderRadius: '9999px', objectFit: 'cover', border: '2px solid #f0dfd0' }}
    />
  )
}

// ── Badge de status ───────────────────────────────────────────────────────────
export function BadgeStatus({ status }) {
  const config = {
    'ativo':         { label: 'Ativo',         cls: 'badge-verde' },
    'em-negociacao': { label: 'Em negociação', cls: 'badge-coral' },
    'doado':         { label: 'Doado',         cls: 'chip-neutral' },
  }
  const c = config[status] || config['ativo']
  return <span className={c.cls}>{c.label}</span>
}

// ── Card de item ──────────────────────────────────────────────────────────────
export function CardItem({ item, usuario, onClick }) {
  return (
    <div onClick={onClick} className="card-hover overflow-hidden"
      style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img src={item.fotos[0]} alt={item.titulo}
          style={{ width: '100%', height: 192, objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        {item.distancia && item.distancia !== '0km' && (
          <span style={{
            position: 'absolute', top: 8, right: 8,
            background: 'rgba(0,0,0,0.6)', color: 'white',
            fontSize: 12, fontWeight: 600, padding: '3px 10px',
            borderRadius: 9999, display: 'flex', alignItems: 'center', gap: 3,
            backdropFilter: 'blur(4px)',
          }}>
            <Icone nome="location_on" tamanho={13}/>
            {item.distancia}
          </span>
        )}
      </div>
      <div style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <h3 style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', margin: 0,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {item.titulo}
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
          {item.descricao}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          {usuario && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Avatar src={usuario.avatar} nome={usuario.nome} tamanho={22}/>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 70,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {usuario.nome.split(' ')[0]}
              </span>
            </div>
          )}
          <span className="chip-coral" style={{ textTransform: 'capitalize' }}>{item.categoria}</span>
        </div>
      </div>
    </div>
  )
}

// ── Estrelas ─────────────────────────────────────────────────────────────────
export function Estrelas({ valor, onChange, tamanho = 32 }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onChange?.(n)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2,
            transition: 'transform 0.1s', fontSize: tamanho }}>
          <Icone nome="star" preenchido={n <= valor} tamanho={tamanho}
            className={n <= valor ? '' : ''}
            style={{ color: n <= valor ? 'var(--coral)' : '#e5cfc0' }}/>
        </button>
      ))}
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function EstadoVazio({ icone, titulo, descricao, acao }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '48px 32px', textAlign: 'center' }}>
      <div style={{ width: 72, height: 72, background: '#f8ece0', borderRadius: 20,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Icone nome={icone} tamanho={34} style={{ color: 'var(--text-muted)' }}/>
      </div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: '0 0 8px' }}>{titulo}</h3>
      {descricao && <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: '0 0 20px', maxWidth: 260 }}>{descricao}</p>}
      {acao}
    </div>
  )
}
