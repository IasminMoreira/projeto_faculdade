import { NavLink } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

const navItens = [
  { para: '/',          icone: 'home',        label: 'Início'    },
  { para: '/mensagens', icone: 'chat_bubble',  label: 'Mensagens' },
  { para: '/anunciar',  icone: 'add_circle',   label: 'Anunciar'  },
  { para: '/perfil',    icone: 'person',       label: 'Perfil'    },
]

export default function BottomNav() {
  const { conversas } = useApp()
  const naoLidasChat = conversas.filter(c => c.naoLidas > 0).length

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-white/95 backdrop-blur-md border-t border-surface-container shadow-nav">
      <div className="flex justify-around items-center px-4 pb-safe pt-2 pb-4 max-w-lg mx-auto">
        {navItens.map(({ para, icone, label }) => (
          <NavLink
            key={para}
            to={para}
            end={para === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center px-3 py-1 rounded-xl transition-all duration-150 active:scale-90 relative
              ${isActive
                ? 'text-primary bg-primary-fixed/40'
                : 'text-outline hover:text-primary'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {icone}
                </span>
                <span className="text-[11px] font-semibold mt-0.5">{label}</span>
                {label === 'Mensagens' && naoLidasChat > 0 && (
                  <span className="absolute top-0 right-1 w-2 h-2 bg-tertiary rounded-full" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
