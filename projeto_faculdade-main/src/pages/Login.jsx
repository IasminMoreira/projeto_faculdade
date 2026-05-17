import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Icone, Logo } from '../components/ui'

export default function Login() {
  const navigate = useNavigate()
  const { login, registrar } = useApp()
  const [aba, setAba] = useState('entrar')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      if (aba === 'entrar') {
        await login(email, senha)
      } else {
        await registrar(nome, email, senha)
      }
      navigate('/')
    } catch (err) {
      const msg = err.response?.data?.message
        ?? err.response?.data?.errors?.email?.[0]
        ?? 'Credenciais inválidas. Verifique e tente novamente.'
      setErro(msg)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', fontSize: 15,
    fontFamily: 'inherit', border: '2px solid #e5cfc0', borderRadius: 10,
    outline: 'none', background: 'white', color: '#2d1f1a',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  }
  function focusInput(e) {
    e.target.style.borderColor = '#c4674e'
    e.target.style.boxShadow = '0 0 0 3px rgba(196,103,78,0.15)'
  }
  function blurInput(e) {
    e.target.style.borderColor = '#e5cfc0'
    e.target.style.boxShadow = 'none'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(at 0% 0%, rgba(232,93,62,0.10) 0px, transparent 55%), radial-gradient(at 100% 100%, rgba(61,128,104,0.08) 0px, transparent 55%), #fffdf9',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 16px' }}>
        <div style={{
          width: '100%', maxWidth: 920,
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          background: 'white', borderRadius: 24, overflow: 'hidden',
          boxShadow: '0 8px 48px rgba(0,0,0,0.12)',
        }}>
          {/* Lado esquerdo — visual */}
          <div style={{
            background: 'linear-gradient(145deg, #2a9470 0%, #1f6650 60%, #154d3c 100%)',
            padding: '40px 36px', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', position: 'relative', overflow: 'hidden', minHeight: 480,
          }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(232,93,62,0.15)' }} />
            <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"
              alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'overlay', opacity: 0.25 }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <Logo height={72} />
              <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', margin: '28px 0 12px', lineHeight: 1.25 }}>
                Transforme o que você não usa em alegria para alguém.
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, lineHeight: 1.6 }}>
                Conectamos doadores e receptores de forma simples, segura e humana.
              </p>
            </div>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 24 }}>
              {[['10k+', 'Doadores'], ['25k+', 'Itens doados'], ['4.9★', 'Avaliação']].map(([n, l]) => (
                <div key={l}>
                  <div style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>{n}</div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Formulário */}
          <div style={{ padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#2d1f1a', margin: '0 0 6px' }}>
              {aba === 'entrar' ? 'Bem-vindo de volta!' : 'Criar sua conta'}
            </h1>
            <p style={{ color: '#7a5e55', fontSize: 14, margin: '0 0 28px' }}>
              {aba === 'entrar' ? 'Entre para continuar doando e recebendo.' : 'Junte-se a milhares de pessoas solidárias.'}
            </p>

            {/* Toggle entrar / cadastrar */}
            <div style={{ display: 'flex', background: '#fdf6ed', borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
              {['entrar', 'cadastrar'].map(t => (
                <button key={t} onClick={() => { setAba(t); setErro('') }} style={{
                  flex: 1, padding: '9px 0', borderRadius: 9, border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: 14, fontFamily: 'inherit', transition: 'all 0.2s',
                  background: aba === t ? 'white' : 'transparent',
                  color: aba === t ? '#c4674e' : '#7a5e55',
                  boxShadow: aba === t ? '0 1px 6px rgba(0,0,0,0.08)' : 'none',
                }}>
                  {t === 'entrar' ? 'Entrar' : 'Criar conta'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {aba === 'cadastrar' && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#7a5e55', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Nome completo</label>
                  <input style={inputStyle} placeholder="Seu nome completo" type="text" required
                    value={nome} onChange={e => setNome(e.target.value)}
                    onFocus={focusInput} onBlur={blurInput} />
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#7a5e55', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>E-mail</label>
                <input style={inputStyle} placeholder="seu@email.com" type="email"
                  value={email} onChange={e => setEmail(e.target.value)} required
                  onFocus={focusInput} onBlur={blurInput} />
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700, color: '#7a5e55', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Senha</label>
                  {aba === 'entrar' && (
                    <a href="#" style={{ fontSize: 13, color: '#c4674e', fontWeight: 600, textDecoration: 'none' }}>Esqueceu?</a>
                  )}
                </div>
                <div style={{ position: 'relative' }}>
                  <input style={{ ...inputStyle, paddingRight: 48 }} placeholder="••••••••"
                    type={mostrarSenha ? 'text' : 'password'}
                    value={senha} onChange={e => setSenha(e.target.value)} required
                    onFocus={focusInput} onBlur={blurInput} />
                  <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#7a5e55', display: 'flex', padding: 4 }}>
                    <Icone nome={mostrarSenha ? 'visibility_off' : 'visibility'} tamanho={20} />
                  </button>
                </div>
              </div>

              {/* Mensagem de erro */}
              {erro && (
                <div style={{ background: '#fdecea', border: '1.5px solid #f5c6c6', borderRadius: 10, padding: '10px 14px', color: '#c0392b', fontSize: 13 }}>
                  {erro}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                background: loading ? '#d9a898' : 'linear-gradient(135deg, #e85d3e, #c4674e)',
                color: 'white', border: 'none', borderRadius: 9999, padding: '14px 0',
                fontWeight: 700, fontSize: 16, fontFamily: 'inherit',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(196,103,78,0.35)', marginTop: 4,
              }}>
                {loading ? (
                  <>
                    <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    {aba === 'entrar' ? 'Entrando...' : 'Criando conta...'}
                  </>
                ) : (
                  <>
                    {aba === 'entrar' ? 'Entrar na conta' : 'Criar minha conta'}
                    <Icone nome="arrow_forward" tamanho={20} />
                  </>
                )}
              </button>
            </form>

            {/* Divisor */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
              <div style={{ flex: 1, height: 1, background: '#e5cfc0' }} />
              <span style={{ fontSize: 13, color: '#7a5e55', fontWeight: 500 }}>ou continue com</span>
              <div style={{ flex: 1, height: 1, background: '#e5cfc0' }} />
            </div>

            {/* Botão Google — placeholder visual (integração OAuth futura) */}
            <button disabled style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              padding: '13px 0', border: '2px solid #e5cfc0', borderRadius: 12,
              background: '#f8f4f0', cursor: 'not-allowed', opacity: 0.6,
              fontWeight: 600, fontSize: 15, fontFamily: 'inherit', color: '#2d1f1a',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Entrar com Google (em breve)
            </button>

            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

            {/* Social proof */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24, paddingTop: 20, borderTop: '1px solid #f0dfd0' }}>
              <div style={{ display: 'flex' }}>
                {[47, 12, 32, 15].map((i, idx) => (
                  <img key={i} src={`https://i.pravatar.cc/32?img=${i}`} alt=""
                    style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid white', marginLeft: idx > 0 ? -8 : 0, objectFit: 'cover' }} />
                ))}
              </div>
              <p style={{ fontSize: 13, color: '#7a5e55', margin: 0 }}>
                <strong style={{ color: '#3d8068' }}>+10 mil</strong> pessoas doando hoje
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer style={{ paddingBottom: 24, display: 'flex', justifyContent: 'center', gap: 24 }}>
        {['Termos de Uso', 'Privacidade', 'Ajuda'].map(l => (
          <a key={l} href="#" style={{ fontSize: 13, color: '#c4674e', textDecoration: 'none', fontWeight: 500 }}>{l}</a>
        ))}
      </footer>
    </div>
  )
}
