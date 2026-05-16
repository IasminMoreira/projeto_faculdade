import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Logo, Icone } from '../ui'

export default function TopBar({ titulo, voltar = false }) {
  const navigate = useNavigate()
  const { notificacoesNaoLidas } = useApp()

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      background: 'rgba(255,253,249,0.97)', backdropFilter: 'blur(12px)',
      borderBottom: '1.5px solid #e5cfc0',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 16px', height: 72, maxWidth: 960, margin: '0 auto' }}>
        {voltar && (
          <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 8,
            borderRadius: 12, display: 'flex', color: 'var(--text-muted)',
            transition: 'background 0.15s',
          }} onMouseEnter={e => e.target.style.background = '#f8ece0'}
            onMouseLeave={e => e.target.style.background = 'none'}>
            <Icone nome="arrow_back"/>
          </button>
        )}
        {titulo
          ? <h1 style={{ flex: 1, fontSize: 20, fontWeight: 700, color: 'var(--text)', margin: 0 }}>{titulo}</h1>
          : <div style={{ flex: 1 }}><Logo height={72}/></div>
        }
        <button onClick={() => navigate('/notificacoes')} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 8,
          borderRadius: 12, display: 'flex', position: 'relative',
          color: 'var(--text-muted)',
        }}>
          <Icone nome="notifications"/>
          {notificacoesNaoLidas > 0 && (
            <span style={{
              position: 'absolute', top: 6, right: 6,
              width: 10, height: 10, background: 'var(--coral)',
              borderRadius: '50%', border: '2px solid white',
            }}/>
          )}
        </button>
      </div>
    </header>
  )
}
