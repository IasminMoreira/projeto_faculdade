import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/layout/Layout'

import Login           from './pages/Login'
import Home            from './pages/Home'
import DetalheItem     from './pages/DetalheItem'
import Mensagens       from './pages/Mensagens'
import Anunciar        from './pages/Anunciar'
import Perfil          from './pages/Perfil'
import PerfilUsuario   from './pages/PerfilUsuario'
import MeusAnuncios    from './pages/MeusAnuncios'
import Notificacoes    from './pages/Notificacoes'
import DoacaoConcluida from './pages/DoacaoConcluida'

function RotasProtegidas() {
  const { autenticado } = useApp()
  if (!autenticado) return <Navigate to="/login" replace />
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"                   element={<Home />} />
        <Route path="/mensagens"          element={<Mensagens />} />
        <Route path="/anunciar"           element={<Anunciar />} />
        <Route path="/perfil"             element={<Perfil />} />
        <Route path="/meus-anuncios"      element={<MeusAnuncios />} />
        <Route path="/notificacoes"       element={<Notificacoes />} />
        <Route path="/doacao-concluida"   element={<DoacaoConcluida />} />
      </Route>
      {/* Telas sem BottomNav */}
      <Route path="/item/:id"         element={<DetalheItem />} />
      <Route path="/perfil/:id"       element={<PerfilUsuario />} />
    </Routes>
  )
}

function LoginOuRedirecionar() {
  const { autenticado } = useApp()
  if (autenticado) return <Navigate to="/" replace />
  return <Login />
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginOuRedirecionar />} />
          <Route path="/*"     element={<RotasProtegidas />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
