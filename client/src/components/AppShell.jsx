import BottomNav from './BottomNav'

export default function AppShell({ children, navActive }) {
  return (
    <div className="app-shell">
      {children}
      {navActive && <BottomNav active={navActive} />}
    </div>
  )
}
