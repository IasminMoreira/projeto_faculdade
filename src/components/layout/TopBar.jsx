import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

export default function TopBar({
  titulo,
  voltar = false,
  busca = false,
  acoes = [],
}) {
  const navigate = useNavigate()
  const { notificacoesNaoLidas } = useApp()

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-surface-container shadow-sm">
      <div className="flex items-center gap-3 px-4 h-16 max-w-5xl mx-auto">
        {/* Esquerda */}
        {voltar ? (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-on-surface-variant">arrow_back</span>
          </button>
        ) : null}

        <span
          className="text-2xl font-black text-primary tracking-tight cursor-pointer"
          onClick={() => navigate('/')}
        >
          Doa aí
        </span>

        {/* Busca expandida */}
        {busca && (
          <div className="flex-1 mx-2">
            <div className="flex items-center gap-2 bg-surface-container-low rounded-full px-md py-sm">
              <span className="material-symbols-outlined text-outline text-[20px]">search</span>
              <input
                className="flex-1 bg-transparent outline-none text-body-md text-on-surface placeholder:text-outline"
                placeholder="Buscar doações..."
              />
            </div>
          </div>
        )}

        {/* Espaço flex */}
        {!busca && <div className="flex-1" />}

        {/* Ações à direita */}
        <div className="flex items-center gap-1">
          {acoes.map((acao) => (
            <button
              key={acao.icone}
              onClick={acao.onClick}
              className="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95 relative"
            >
              <span className="material-symbols-outlined text-on-surface-variant">{acao.icone}</span>
              {acao.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary rounded-full" />
              )}
            </button>
          ))}
          <button
            onClick={() => navigate('/notificacoes')}
            className="p-2 rounded-full hover:bg-surface-container transition-colors active:scale-95 relative"
          >
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            {notificacoesNaoLidas > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-tertiary rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Título de página (quando não é logo) */}
      {titulo && (
        <div className="px-4 pb-3 max-w-5xl mx-auto">
          <h1 className="text-h2 font-h2 text-on-surface">{titulo}</h1>
        </div>
      )}
    </header>
  )
}
