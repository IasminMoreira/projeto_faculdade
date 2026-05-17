import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icone, Estrelas, Avatar, Logo } from '../components/ui'
import { usuarioAtual } from '../data/mock'

export default function DoacaoConcluida() {
  const navigate = useNavigate()
  const [nota, setNota] = useState(4)
  const [feedback, setFeedback] = useState('')

  function handleFinalizar() {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-creme-300 flex items-center justify-between px-4 h-16 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-creme-200 active:scale-95">
          <Icone nome="close" className="text-on-surface-muted" />
        </button>
        <Logo height={72}/>
        <div className="flex gap-1">
          <button className="p-2 rounded-full hover:bg-creme-200">
            <Icone nome="location_on" className="text-on-surface-muted" />
          </button>
          <button className="p-2 rounded-full hover:bg-creme-200">
            <Icone nome="notifications" className="text-on-surface-muted" />
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-lg mx-auto px-4 py-xxl w-full">
        {/* Animação de sucesso */}
        <section className="flex flex-col items-center text-center mb-xl">
          <div className="relative w-48 h-48 mb-lg">
            <div className="absolute inset-0 bg-coral-50 opacity-20 rounded-full animate-pulse" />
            <div className="absolute inset-4 bg-coral-50-dim rounded-full flex items-center justify-center">
              <Icone nome="check_circle" tamanho={80} preenchido className="text-verde-600" />
            </div>
          </div>
          <h1 className="text-h1 font-h1 text-on-surface mb-sm">Parabéns pela sua doação!</h1>
          <p className="text-body-lg text-on-surface-muted px-md">
            Você acabou de fazer o dia de alguém melhor. Sua generosidade fortalece nossa comunidade.
          </p>
        </section>

        {/* Avaliação */}
        <section className="card p-lg mb-lg">
          <div className="flex items-center gap-md mb-lg">
            <Avatar src={usuarioAtual.avatar} nome={usuarioAtual.nome} tamanho={64} />
            <div>
              <h3 className="text-h3 font-h3 text-on-surface">Ricardo Silva</h3>
              <p className="text-label-md text-on-surface-muted uppercase tracking-wider">Doador Parceiro</p>
            </div>
          </div>

          <div className="text-center mb-lg">
            <p className="text-body-md text-on-surface mb-md">Como foi sua experiência com Ricardo Silva?</p>
            <div className="flex justify-center">
              <Estrelas valor={nota} onChange={setNota} tamanho={40} />
            </div>
          </div>

          <div className="space-y-xs">
            <label className="text-label-md text-on-surface-muted">
              Conte mais sobre a entrega <span className="font-normal">(opcional)</span>
            </label>
            <textarea
              className="input h-auto py-md"
              rows={3}
              placeholder="Foi fácil encontrar o local? O item estava como descrito?"
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
            />
          </div>
        </section>

        {/* Ações */}
        <div className="flex flex-col gap-md mb-xl">
          <button onClick={handleFinalizar} className="btn-coral w-full text-body-lg py-lg">
            Finalizar
            <Icone nome="arrow_forward" />
          </button>
          <button className="btn-outline-coral w-full">
            Compartilhar meu impacto
          </button>
        </div>

        {/* Prova social */}
        <div className="text-center">
          <div className="flex justify-center -space-x-3 mb-sm">
            {[47, 12, 32].map(i => (
              <img key={i} src={`https://i.pravatar.cc/40?img=${i}`} alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-white bg-coral-50-dim flex items-center justify-center text-[10px] font-bold text-verde-600">
              +12
            </div>
          </div>
          <p className="text-label-md text-on-surface-muted">
            Outras 12 pessoas doaram para o Ricardo esta semana
          </p>
        </div>
      </main>
    </div>
  )
}
