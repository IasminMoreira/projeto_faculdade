import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Icone } from '../ui'

const navItens = [
  { para: '/',          icone: 'home',       label: 'Início'    },
  { para: '/mensagens', icone: 'chat_bubble', label: 'Mensagens' },
  { para: '/anunciar',  icone: 'add_circle',  label: 'Anunciar'  },
  { para: '/perfil',    icone: 'person',      label: 'Perfil'    },
]

export default function BottomNav() {
  const { conversas } = useApp()
  const naoLidas = conversas.filter(c => c.naoLidas > 0).length

  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, width: '100%', zIndex: 50,
      background: 'rgba(255,253,249,0.97)', backdropFilter: 'blur(12px)',
      borderTop: '1.5px solid #e5cfc0', boxShadow: '0 -4px 24px rgba(45,31,26,0.08)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '8px 16px 16px', maxWidth: 480, margin: '0 auto' }}>
        {navItens.map(({ para, icone, label }) => (
          <NavLink key={para} to={para} end={para === '/'}
            style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                padding: '6px 16px', borderRadius: 14, cursor: 'pointer',
                background: isActive ? 'rgba(196,103,78,0.1)' : 'transparent',
                color: isActive ? 'var(--coral)' : 'var(--text-muted)',
                transition: 'all 0.15s ease', position: 'relative',
              }}>
                <span className="material-symbols-outlined"
                  style={{
                    fontSize: 24,
                    fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                  }}>
                  {icone}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{label}</span>
                {label === 'Mensagens' && naoLidas > 0 && (
                  <span style={{
                    position: 'absolute', top: 4, right: 10,
                    width: 10, height: 10, background: 'var(--coral)',
                    borderRadius: '50%', border: '2px solid white',
                  }}/>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
