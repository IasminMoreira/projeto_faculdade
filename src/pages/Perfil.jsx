import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icone, BadgeStatus, Logo } from '../components/ui'

const abas = ['Itens Ativos', 'Histórico']

export default function Perfil() {
  const navigate = useNavigate()
  const { usuario, meusItens, atualizarUsuario, logout } = useApp()
  const [abaAtiva, setAbaAtiva] = useState(0)
  const [editando, setEditando] = useState(false)
  const [nomeEdit, setNomeEdit] = useState(usuario.nome)
  const [cidadeEdit, setCidadeEdit] = useState(usuario.cidade)
  const [avatarUrl, setAvatarUrl] = useState(usuario.avatar)
  const [modalConfig, setModalConfig] = useState(false)
  const fotoRef = useRef(null)

  const itensAtivos    = meusItens.filter(i => i.status === 'ativo' || i.status === 'em-negociacao')
  const itensHistorico = meusItens.filter(i => i.status === 'doado')
  const itensExibidos  = abaAtiva === 0 ? itensAtivos : itensHistorico

  function handleFoto(e) {
    const f = e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = ev => {
      setAvatarUrl(ev.target.result)
      atualizarUsuario({ avatar: ev.target.result })
    }
    reader.readAsDataURL(f)
  }

  function salvarPerfil() {
    atualizarUsuario({ nome: nomeEdit, cidade: cidadeEdit })
    setEditando(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-creme-300 flex items-center justify-between px-4 h-16">
        <Logo height={72}/>
        <div className="flex gap-1">
          <button onClick={() => navigate('/notificacoes')} className="p-2 rounded-full hover:bg-creme-200 active:scale-95 relative">
            <Icone nome="notifications" className="text-on-surface-muted" />
          </button>
          <button onClick={() => setModalConfig(true)} className="p-2 rounded-full hover:bg-creme-200 active:scale-95">
            <Icone nome="settings" className="text-on-surface-muted" />
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-xl pb-32">
        {/* Header do perfil */}
        <div className="flex items-start gap-xl mb-xl">
          <div className="relative flex-shrink-0">
            <img
              src={avatarUrl}
              alt={usuario.nome}
              className="w-24 h-24 rounded-full object-cover border-2 border-primary-fixed"
            />
            <button
              onClick={() => fotoRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:brightness-110 active:scale-95">
              <Icone nome="photo_camera" tamanho={16} className="text-on-primary" />
            </button>
            <input ref={fotoRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
          </div>

          <div className="flex-1 min-w-0">
            {editando ? (
              <div className="space-y-sm">
                <div>
                  <label className="text-label-md text-on-surface-muted block mb-xs">Nome</label>
                  <input className="input py-sm" value={nomeEdit} onChange={e => setNomeEdit(e.target.value)} />
                </div>
                <div>
                  <label className="text-label-md text-on-surface-muted block mb-xs">Cidade</label>
                  <input className="input py-sm" value={cidadeEdit} onChange={e => setCidadeEdit(e.target.value)} />
                </div>
                <div className="flex gap-sm pt-xs">
                  <button onClick={salvarPerfil} className="btn-verde flex-1 py-sm text-sm">
                    <Icone nome="check" tamanho={16} />Salvar
                  </button>
                  <button onClick={() => { setEditando(false); setNomeEdit(usuario.nome); setCidadeEdit(usuario.cidade) }}
                    className="btn-outline-coral flex-1 py-sm text-sm">Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-md flex-wrap mb-xs">
                  <h1 className="text-h2 font-h2 text-on-surface">{nomeEdit}</h1>
                  <span className="chip bg-coral-50 text-on-primary-fixed-variant flex items-center gap-xs">
                    <Icone nome="star" tamanho={14} preenchido className="text-tertiary" />
                    {usuario.avaliacao} • {usuario.totalDoacoes} doações
                  </span>
                </div>
                <p className="text-on-surface-muted flex items-center gap-xs mb-md">
                  <Icone nome="location_on" tamanho={16} />{cidadeEdit}
                </p>
                <button onClick={() => setEditando(true)} className="btn-outline-coral py-sm px-lg text-sm">
                  <Icone nome="edit" tamanho={16} />Editar Perfil
                </button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-md mb-xl">
          {[
            { valor: usuario.totalDoacoes,              label: 'Doações realizadas', icone: 'volunteer_activism', cor: 'text-verde-600'  },
            { valor: usuario.itensRecebidos,             label: 'Itens recebidos',    icone: 'archive',           cor: 'text-coral-600' },
            { valor: `${usuario.anosNaPlataforma} anos`, label: 'Na plataforma',      icone: 'calendar_month',    cor: 'text-tertiary'  },
          ].map(({ valor, label, icone, cor }) => (
            <div key={label} className="card p-lg text-center">
              <Icone nome={icone} tamanho={28} className={`${cor} mb-sm`} />
              <p className={`text-h2 font-h2 ${cor}`}>{valor}</p>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-muted">{label}</p>
            </div>
          ))}
        </div>

        {/* Ações rápidas */}
        <div className="grid grid-cols-2 gap-md mb-xl">
          <button onClick={() => navigate('/meus-anuncios')}
            className="card p-md flex items-center gap-md hover:shadow-modal transition-shadow active:scale-[0.99] text-left">
            <div className="w-10 h-10 bg-coral-50 rounded-xl flex items-center justify-center flex-shrink-0">
              <Icone nome="inventory_2" className="text-verde-600" />
            </div>
            <div>
              <p className="font-semibold text-on-surface text-sm">Meus Anúncios</p>
              <p className="text-xs text-on-surface-muted">{meusItens.length} itens</p>
            </div>
          </button>
          <button onClick={() => navigate('/anunciar')}
            className="card p-md flex items-center gap-md hover:shadow-modal transition-shadow active:scale-[0.99] text-left">
            <div className="w-10 h-10 bg-tertiary-fixed rounded-xl flex items-center justify-center flex-shrink-0">
              <Icone nome="add_circle" className="text-tertiary" />
            </div>
            <div>
              <p className="font-semibold text-on-surface text-sm">Novo Anúncio</p>
              <p className="text-xs text-on-surface-muted">Publicar doação</p>
            </div>
          </button>
        </div>

        {/* Abas */}
        <div className="flex border-b border-creme-300 mb-xl">
          {abas.map((aba, i) => (
            <button key={aba} onClick={() => setAbaAtiva(i)}
              className={`px-lg py-md text-label-md font-semibold transition-all border-b-2
                ${abaAtiva === i ? 'border-primary text-verde-600' : 'border-transparent text-on-surface-muted hover:text-on-surface'}`}>
              {aba}
              <span className={`ml-sm text-xs px-xs py-xs rounded-full ${abaAtiva === i ? 'bg-coral-50 text-verde-600' : 'bg-creme-100 text-on-surface-muted'}`}>
                {i === 0 ? itensAtivos.length : itensHistorico.length}
              </span>
            </button>
          ))}
        </div>

        {itensExibidos.length === 0 ? (
          <div className="text-center py-xxl text-on-surface-muted">
            <Icone nome="inventory_2" tamanho={64} className="text-surface-container-highest mb-md" />
            <p className="text-h3 font-h3">Nenhum item aqui ainda</p>
            {abaAtiva === 0 && (
              <button onClick={() => navigate('/anunciar')} className="btn-verde mt-lg">
                <Icone nome="add" />Publicar doação
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {itensExibidos.map(item => (
              <button key={item.id} onClick={() => navigate(`/item/${item.id}`)}
                className="card overflow-hidden text-left hover:shadow-modal transition-shadow active:scale-[0.99]">
                <img src={item.fotos[0]} alt={item.titulo} className="w-full h-44 object-cover" />
                <div className="p-md">
                  <div className="flex items-start justify-between mb-xs gap-sm">
                    <h3 className="font-semibold text-on-surface flex-1 min-w-0 truncate">{item.titulo}</h3>
                    <BadgeStatus status={item.status} />
                  </div>
                  <p className="text-sm text-on-surface-muted line-clamp-1 mb-sm">{item.descricao}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-on-surface-muted flex items-center gap-xs">
                      <Icone nome="schedule" tamanho={14} />Postado recentemente
                    </p>
                    {item.interessados > 0 && (
                      <span className="text-xs text-verde-600 font-semibold">{item.interessados} interessados</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal Configurações */}
      {modalConfig && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4" onClick={() => setModalConfig(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-modal overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-lg border-b border-creme-300">
              <h3 className="font-semibold text-on-surface text-h3">Configurações</h3>
            </div>
            <div className="divide-y divide-surface-container">
              {[
                { icone: 'notifications', label: 'Notificações', sub: 'Gerenciar alertas', acao: () => { setModalConfig(false); navigate('/notificacoes') } },
                { icone: 'lock', label: 'Privacidade', sub: 'Controle de dados', acao: () => {} },
                { icone: 'help', label: 'Ajuda', sub: 'Central de suporte', acao: () => {} },
                { icone: 'description', label: 'Termos de Uso', sub: 'Política e privacidade', acao: () => {} },
              ].map(({ icone, label, sub, acao }) => (
                <button key={label} onClick={acao}
                  className="w-full flex items-center gap-md px-lg py-md hover:bg-creme-200 transition-colors text-left">
                  <div className="w-10 h-10 bg-creme-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icone nome={icone} className="text-on-surface-muted" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-on-surface text-sm">{label}</p>
                    <p className="text-xs text-on-surface-muted">{sub}</p>
                  </div>
                  <Icone nome="chevron_right" className="text-on-surface-muted" />
                </button>
              ))}
              <button onClick={() => { setModalConfig(false); logout(); navigate('/login') }}
                className="w-full flex items-center gap-md px-lg py-md hover:bg-error-container transition-colors text-left">
                <div className="w-10 h-10 bg-error-container rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icone nome="logout" className="text-error" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-error text-sm">Sair da conta</p>
                  <p className="text-xs text-on-surface-muted">Fazer logout</p>
                </div>
              </button>
            </div>
            <div className="p-lg border-t border-creme-300">
              <button onClick={() => setModalConfig(false)} className="w-full text-on-surface-muted text-sm hover:text-on-surface">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
