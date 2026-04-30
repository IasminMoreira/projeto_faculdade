// ─── Ícone Material ──────────────────────────────────────────────────────────
export function Icone({ nome, preenchido = false, tamanho = 24, className = '' }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: tamanho,
        fontVariationSettings: preenchido
          ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24"
          : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
      }}
    >
      {nome}
    </span>
  )
}

// ─── Botão ────────────────────────────────────────────────────────────────────
export function Botao({ children, variante = 'primary', className = '', ...props }) {
  const estilos = {
    primary:   'bg-tertiary text-on-tertiary hover:brightness-110',
    secondary: 'bg-primary text-on-primary hover:bg-surface-tint',
    outline:   'border border-primary text-primary hover:bg-primary-fixed/20',
    ghost:     'text-primary hover:bg-primary-fixed/20',
  }
  return (
    <button
      className={`flex items-center justify-center gap-sm font-semibold py-md px-xl rounded-full
                  active:scale-95 transition-all duration-150 shadow-sm
                  ${estilos[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── Chip de categoria ────────────────────────────────────────────────────────
export function ChipCategoria({ label, ativo = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-md py-xs rounded-full text-label-md font-semibold transition-all whitespace-nowrap
        ${ativo
          ? 'bg-primary text-on-primary shadow-sm'
          : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
        }`}
    >
      {label}
    </button>
  )
}

// ─── Badge de status ──────────────────────────────────────────────────────────
export function BadgeStatus({ status }) {
  const config = {
    ativo:          { label: 'Ativo',          cor: 'bg-primary-fixed text-on-primary-fixed-variant' },
    'em-negociacao':{ label: 'Em negociação',  cor: 'bg-secondary-fixed text-on-secondary-fixed-variant' },
    doado:          { label: 'Doado',          cor: 'bg-surface-container-highest text-on-surface-variant' },
  }
  const c = config[status] || config.ativo
  return (
    <span className={`text-[11px] font-bold uppercase tracking-wider px-sm py-xs rounded ${c.cor}`}>
      {c.label}
    </span>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
export function Avatar({ src, nome, tamanho = 40 }) {
  return (
    <img
      src={src || `https://ui-avatars.com/api/?name=${encodeURIComponent(nome || 'U')}&background=b1f0ce&color=0f5238`}
      alt={nome}
      className="rounded-full object-cover border-2 border-primary-fixed"
      style={{ width: tamanho, height: tamanho }}
    />
  )
}

// ─── Card de item ─────────────────────────────────────────────────────────────
export function CardItem({ item, usuario, onClick }) {
  return (
    <div
      onClick={onClick}
      className="card cursor-pointer hover:shadow-modal transition-shadow duration-200 overflow-hidden"
    >
      <div className="relative">
        <img
          src={item.fotos[0]}
          alt={item.titulo}
          className="w-full h-48 object-cover"
        />
        {item.distancia && item.distancia !== '0km' && (
          <span className="absolute top-2 right-2 bg-inverse-surface/80 text-inverse-on-surface text-xs font-semibold px-sm py-xs rounded-full flex items-center gap-1">
            <Icone nome="location_on" tamanho={12} />
            {item.distancia}
          </span>
        )}
      </div>
      <div className="p-md">
        <h3 className="font-semibold text-on-surface text-body-md leading-snug mb-xs">{item.titulo}</h3>
        <p className="text-on-surface-variant text-sm line-clamp-1 mb-sm">{item.descricao}</p>
        <div className="flex items-center justify-between">
          {usuario && (
            <div className="flex items-center gap-xs">
              <Avatar src={usuario.avatar} nome={usuario.nome} tamanho={24} />
              <span className="text-xs text-on-surface-variant">{usuario.nome.split(' ')[0]} {usuario.nome.split(' ')[1]?.[0]}.</span>
            </div>
          )}
          <span className="chip bg-surface-container text-on-surface-variant text-xs uppercase tracking-wide">
            {item.categoria}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Estrelas de avaliação ────────────────────────────────────────────────────
export function Estrelas({ valor, onChange, tamanho = 32 }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange?.(n)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Icone
            nome="star"
            preenchido={n <= valor}
            tamanho={tamanho}
            className={n <= valor ? 'text-tertiary' : 'text-outline'}
          />
        </button>
      ))}
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────
export function EstadoVazio({ icone, titulo, descricao, acao }) {
  return (
    <div className="flex flex-col items-center justify-center py-xxl text-center px-xl">
      <Icone nome={icone} tamanho={64} className="text-surface-container-highest mb-lg" />
      <h3 className="text-h3 font-h3 text-on-surface-variant mb-sm">{titulo}</h3>
      {descricao && <p className="text-body-md text-outline mb-lg">{descricao}</p>}
      {acao}
    </div>
  )
}
