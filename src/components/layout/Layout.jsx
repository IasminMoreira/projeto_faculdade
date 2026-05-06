import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div style={{ minHeight:'100vh', background:'var(--creme)' }}>
      <main style={{ paddingBottom: 80 }}>
        <Outlet/>
      </main>
      <BottomNav/>
    </div>
  )
}
