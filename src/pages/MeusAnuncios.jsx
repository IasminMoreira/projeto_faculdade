import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icone, BadgeStatus } from '../components/ui'
import { categorias } from '../data/mock'

const FILTROS = ['Todos', 'Ativos', 'Em negociação', 'Finalizados']
const condicoes = ['Novo', 'Bom estado', 'Usado']

export default function MeusAnuncios() {
  const navigate = useNavigate()
  const { meusItens, marcarComoDoado, excluirItem, editarItem } = useApp()
  const [filtroAtivo, setFiltroAtivo] = useState('Todos')
  const [confirmandoExcluir, setConfirmandoExcluir] = useState(null)
  const [editandoItem, setEditandoItem] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editFotos, setEditFotos] = useState([])
  const fotoEditRef = useRef(null)

  const itensFiltrados = meusItens.filter(item => {
    if (filtroAtivo === 'Ativos') return item.status === 'ativo'
    if (filtroAtivo === 'Em negociação') return item.status === 'em-negociacao'
    if (filtroAtivo === 'Finalizados') return item.status === 'doado'
    return true
  })

  const stats = {
    ativos:       meusItens.filter(i => i.status === 'ativo').length,
    negociacao:   meusItens.filter(i => i.status === 'em-negociacao').length,
    doados:       meusItens.filter(i => i.status === 'doado').length,
    interessados: meusItens.reduce((acc, i) => acc + (i.interessados || 0), 0),
  }

  function abrirEdicao(item) {
    setEditandoItem(item.id)
    setEditForm({ titulo: item.titulo, descricao: item.descricao, categoria: item.categoria, condicao: item.condicao })
    setEditFotos(item.fotos || [])
  }

  function salvarEdicao() {
    editarItem(editandoItem, { ...editForm, fotos: editFotos.length > 0 ? editFotos : undefined })
    setEditandoItem(null)
    setEditForm({})
    setEditFotos([])
  }

  function handleFotoEdit(e) {
    const arquivos = Array.from(e.target.files)
    arquivos.forEach(arquivo => {
      const reader = new FileReader()
      reader.onload = ev => {
        setEditFotos(prev => prev.length < 4 ? [...prev, ev.target.result] : prev)
      }
      reader.readAsDataURL(arquivo)
    })
  }

  function removerFotoEdit(idx) {
    setEditFotos(prev => prev.filter((_, i) => i !== idx))
  }

  function handleExcluir(itemId) {
    if (confirmandoExcluir === itemId) {
      excluirItem(itemId)
      setConfirmandoExcluir(null)
    } else {
      setConfirmandoExcluir(itemId)
      setTimeout(() => setConfirmandoExcluir(null), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header sem links redundantes */}
      <header className="sticky top-0 z-40 bg-white border-b border-surface-container px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-md">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-surface-container active:scale-95">
            <Icone nome="arrow_back" className="text-on-surface-variant" />
          </button>
          <span className="text-xl font-black text-primary">Meus Anúncios</span>
        </div>
        <button onClick={() => navigate('/notificacoes')} className="p-2 rounded-full hover:bg-surface-container active:scale-95">
          <Icone nome="notifications" className="text-on-surface-variant" />
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-xl pb-32">
        <p className="text-body-md text-on-surface-variant mb-xl">Gerencie suas doações e acompanhe o interesse da comunidade.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
          {[
            { valor: stats.ativos.toString().padStart(2,'0'),      label: 'Ativos',           cor: 'text-on-surface' },
            { valor: stats.negociacao.toString().padStart(2,'0'),  label: 'Em negociação',    cor: 'text-secondary' },
            { valor: stats.doados.toString().padStart(2,'0'),      label: 'Doados este mês',  cor: 'text-tertiary' },
            { valor: stats.interessados.toString().padStart(2,'0'),label: 'Pessoas ajudadas', cor: 'text-primary' },
          ].map(({ valor, label, cor }) => (
            <div key={label} className="card p-md">
              <p className={`text-h2 font-h2 ${cor}`}>{valor}</p>
              <p className="text-label-md text-on-surface-variant">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-sm flex-wrap mb-lg">
          {FILTROS.map(f => (
            <button key={f} onClick={() => setFiltroAtivo(f)}
              className={`px-lg py-sm rounded-full text-label-md font-semibold transition-all
                ${filtroAtivo === f ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
              {f}{f === 'Todos' ? ` (${meusItens.length})` : ''}
            </button>
          ))}
        </div>

        {itensFiltrados.length === 0 ? (
          <div className="card p-xxl text-center text-on-surface-variant">
            <Icone nome="inventory_2" tamanho={64} className="text-surface-container-highest mb-md" />
            <p className="text-h3 font-h3">Nenhum item aqui</p>
            <button onClick={() => navigate('/anunciar')} className="btn-secondary mt-lg">
              <Icone nome="add" />Publicar doação
            </button>
          </div>
        ) : (
          <div className="space-y-md">
            {itensFiltrados.map(item => (
              <div key={item.id} className="card overflow-hidden">
                <div className="flex gap-md p-md">
                  <div className="relative flex-shrink-0 cursor-pointer" onClick={() => navigate(`/item/${item.id}`)}>
                    <img src={item.fotos[0]} alt={item.titulo} className="w-32 h-32 object-cover rounded-lg" />
                    <div className="absolute top-2 left-2"><BadgeStatus status={item.status} /></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-on-surface text-body-md flex-1 min-w-0 truncate pr-sm">{item.titulo}</h3>
                      <div className="flex gap-xs flex-shrink-0">
                        <button onClick={() => abrirEdicao(item)}
                          className="p-2 rounded-lg hover:bg-surface-container active:scale-95 transition-all"
                          title="Editar">
                          <Icone nome="edit" tamanho={18} className="text-on-surface-variant" />
                        </button>
                        <button onClick={() => handleExcluir(item.id)}
                          className={`p-2 rounded-lg active:scale-95 transition-all ${confirmandoExcluir === item.id ? 'bg-error-container' : 'hover:bg-error-container'}`}
                          title="Excluir">
                          <Icone nome="delete" tamanho={18} className={confirmandoExcluir === item.id ? 'text-error' : 'text-on-surface-variant'} />
                        </button>
                      </div>
                    </div>
                    {confirmandoExcluir === item.id && (
                      <p className="text-xs text-error bg-error-container px-sm py-xs rounded mt-xs">Clique novamente para confirmar exclusão</p>
                    )}
                    <p className="text-sm text-on-surface-variant flex items-center gap-xs mt-xs">
                      <Icone nome="calendar_today" tamanho={14} />Publicado recentemente
                    </p>
                    {item.interessados > 0 ? (
                      <div className="flex items-center gap-sm mt-sm">
                        <div className="flex -space-x-1">
                          {[47, 12].slice(0, Math.min(item.interessados, 2)).map(n => (
                            <img key={n} src={`https://i.pravatar.cc/24?img=${n}`} alt="" className="w-6 h-6 rounded-full border-2 border-white" />
                          ))}
                        </div>
                        <span className="text-sm text-on-surface-variant">
                          {item.interessados} {item.interessados === 1 ? 'pessoa interessada' : 'pessoas interessadas'}
                        </span>
                      </div>
                    ) : (
                      <span className="inline-block mt-sm text-sm text-on-surface-variant bg-surface-container px-md py-xs rounded-full italic">Nenhum interessado ainda</span>
                    )}
                    {item.negociacaoInfo && (
                      <div className="mt-sm flex items-center gap-sm bg-secondary-fixed text-on-secondary-fixed-variant px-md py-sm rounded-lg">
                        <Icone nome="chat_bubble" tamanho={16} />
                        <span className="text-sm">{item.negociacaoInfo}</span>
                      </div>
                    )}
                  </div>
                </div>
                {item.status !== 'doado' && (
                  <div className="px-md pb-md">
                    <button onClick={() => marcarComoDoado(item.id)} className="btn-secondary w-full py-sm text-sm">
                      <Icone nome="check_circle" tamanho={18} />Marcar como Doado
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB com ícone visível */}
      <button onClick={() => navigate('/anunciar')}
        className="fixed bottom-8 right-6 w-14 h-14 bg-tertiary rounded-full shadow-modal flex items-center justify-center active:scale-95 hover:brightness-110 transition-all z-40"
        title="Novo anúncio">
        <span className="material-symbols-outlined text-on-tertiary" style={{ fontSize: 28, fontVariationSettings: "'FILL' 1" }}>add</span>
      </button>

      {/* Modal de edição com troca de imagem */}
      {editandoItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditandoItem(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-modal overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-lg border-b border-surface-container flex-shrink-0">
              <h3 className="font-semibold text-on-surface text-h3">Editar anúncio</h3>
              <button onClick={() => setEditandoItem(null)} className="p-1 rounded-full hover:bg-surface-container">
                <Icone nome="close" className="text-on-surface-variant" />
              </button>
            </div>

            <div className="p-lg space-y-md overflow-y-auto flex-1">
              {/* Troca de fotos */}
              <div>
                <label className="block text-label-md text-on-surface-variant mb-xs">Fotos</label>
                <input ref={fotoEditRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFotoEdit} />
                <div className="grid grid-cols-4 gap-sm">
                  {editFotos.length < 4 && (
                    <button type="button" onClick={() => fotoEditRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low flex flex-col items-center justify-center hover:bg-surface-container transition-colors">
                      <Icone nome="add_photo_alternate" tamanho={24} className="text-primary" />
                    </button>
                  )}
                  {editFotos.map((foto, i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden relative border border-surface-container">
                      <img src={foto} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removerFotoEdit(i)}
                        className="absolute top-0.5 right-0.5 bg-error text-on-error rounded-full w-5 h-5 flex items-center justify-center">
                        <Icone nome="close" tamanho={12} />
                      </button>
                      {i === 0 && <span className="absolute bottom-0.5 left-0.5 bg-inverse-surface/70 text-inverse-on-surface text-[9px] font-bold px-xs rounded">Principal</span>}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-label-md text-on-surface-variant mb-xs">Título</label>
                <input className="input" value={editForm.titulo || ''} onChange={e => setEditForm(f => ({ ...f, titulo: e.target.value }))} />
              </div>
              <div>
                <label className="block text-label-md text-on-surface-variant mb-xs">Descrição</label>
                <textarea className="input h-auto py-md" rows={3}
                  value={editForm.descricao || ''} onChange={e => setEditForm(f => ({ ...f, descricao: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block text-label-md text-on-surface-variant mb-xs">Categoria</label>
                  <div className="relative">
                    <select className="input appearance-none pr-8 py-sm text-sm"
                      value={editForm.categoria || ''} onChange={e => setEditForm(f => ({ ...f, categoria: e.target.value }))}>
                      {categorias.filter(c => c.id !== 'todos').map(c => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                    <Icone nome="expand_more" tamanho={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-label-md text-on-surface-variant mb-xs">Condição</label>
                  <div className="flex flex-col gap-xs">
                    {condicoes.map(c => (
                      <button key={c} type="button" onClick={() => setEditForm(f => ({ ...f, condicao: c }))}
                        className={`px-sm py-xs rounded-lg border text-sm transition-all text-left
                          ${editForm.condicao === c ? 'border-primary bg-primary-fixed text-on-primary-fixed-variant font-semibold' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-md p-lg border-t border-surface-container flex-shrink-0">
              <button onClick={() => setEditandoItem(null)} className="btn-outline flex-1 py-sm text-sm">Cancelar</button>
              <button onClick={salvarEdicao} disabled={!editForm.titulo?.trim()}
                className="btn-secondary flex-1 py-sm text-sm disabled:opacity-50">
                <Icone nome="check" tamanho={16} />Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
