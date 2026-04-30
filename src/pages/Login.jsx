import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icone } from '../components/ui'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useApp()
  const [aba, setAba] = useState('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    login(email, senha)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-xxl">
      <div className="w-full max-w-[1000px] grid md:grid-cols-2 bg-surface-container-lowest rounded-xl overflow-hidden shadow-modal">

        {/* Lado esquerdo — visual */}
        <div className="hidden md:flex relative overflow-hidden bg-primary-container">
          <img
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"
            alt="Comunidade unida"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/40 to-transparent flex flex-col justify-end p-xl text-on-primary">
            <h2 className="text-h2 font-h2 mb-md">
              Conectando quem quer ajudar com quem precisa.
            </h2>
            <p className="text-body-lg opacity-90">
              Junte-se à nossa comunidade de solidariedade e faça a diferença hoje mesmo.
            </p>
          </div>
        </div>

        {/* Lado direito — formulário */}
        <div className="p-xl md:p-xxl flex flex-col justify-center">
          <div className="mb-xl">
            <span className="text-2xl font-black text-primary tracking-tight">Doa aí</span>
          </div>

          {/* Toggle Entrar / Criar Conta */}
          <div className="flex bg-surface-container rounded-lg p-xs mb-xl">
            {['entrar', 'cadastrar'].map(t => (
              <button
                key={t}
                onClick={() => setAba(t)}
                className={`flex-1 py-sm px-md rounded-lg text-label-md font-semibold transition-all duration-200
                  ${aba === t
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-outline hover:text-primary'
                  }`}
              >
                {t === 'entrar' ? 'Entrar' : 'Criar Conta'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-lg">
            {aba === 'cadastrar' && (
              <div>
                <label className="block text-label-md text-on-surface-variant mb-xs">Nome completo</label>
                <div className="relative">
                  <Icone nome="person" className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />
                  <input className="input pl-10" placeholder="Seu nome" type="text" required />
                </div>
              </div>
            )}

            <div>
              <label className="block text-label-md text-on-surface-variant mb-xs">E-mail</label>
              <div className="relative">
                <Icone nome="mail" className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />
                <input
                  className="input pl-10"
                  placeholder="seu@email.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-xs">
                <label className="block text-label-md text-on-surface-variant">Senha</label>
                {aba === 'entrar' && (
                  <a href="#" className="text-xs font-semibold text-secondary hover:underline">Esqueceu a senha?</a>
                )}
              </div>
              <div className="relative">
                <Icone nome="lock" className="absolute left-md top-1/2 -translate-y-1/2 text-outline" />
                <input
                  className="input pl-10 pr-12"
                  placeholder="••••••••"
                  type={mostrarSenha ? 'text' : 'password'}
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
                >
                  <Icone nome={mostrarSenha ? 'visibility_off' : 'visibility'} />
                </button>
              </div>
            </div>

            {aba === 'entrar' && (
              <div className="flex items-center gap-sm">
                <input type="checkbox" id="lembrar" className="w-4 h-4 rounded border-outline-variant text-primary" />
                <label htmlFor="lembrar" className="text-label-md text-on-surface-variant select-none">Lembrar de mim</label>
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              {aba === 'entrar' ? 'Entrar na conta' : 'Criar conta'}
              <Icone nome="arrow_forward" />
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-xl">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface-container-lowest px-md text-outline font-semibold uppercase tracking-wider">
                Ou entrar com
              </span>
            </div>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-md">
            {[
              { label: 'Google', logo: (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              )},
              { label: 'Facebook', logo: (
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              )},
            ].map(({ label, logo }) => (
              <button
                key={label}
                className="flex items-center justify-center gap-sm py-md px-md rounded-lg border border-outline-variant bg-surface hover:bg-surface-container transition-colors active:scale-95"
              >
                {logo}
                <span className="text-label-md">{label}</span>
              </button>
            ))}
          </div>

          {/* Social proof */}
          <div className="mt-xl pt-lg border-t border-surface-container flex items-center justify-center gap-md">
            <div className="flex -space-x-2">
              {[47, 12, 32].map(i => (
                <img key={i} src={`https://i.pravatar.cc/32?img=${i}`} alt="usuário" className="w-8 h-8 rounded-full border-2 border-surface-container-lowest" />
              ))}
            </div>
            <p className="text-xs text-on-surface-variant font-medium">+10k pessoas doando hoje</p>
          </div>
        </div>
      </div>

      {/* Rodapé */}
      <footer className="mt-lg flex flex-col items-center gap-sm text-outline">
        <div className="flex items-center gap-xs">
          <Icone nome="verified_user" tamanho={18} />
          <span className="text-xs font-semibold tracking-wide uppercase">Ambiente 100% Seguro</span>
        </div>
        <div className="flex gap-md text-xs">
          {['Termos de Uso', 'Privacidade', 'Ajuda'].map(l => (
            <a key={l} href="#" className="hover:text-primary transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
