import { NavLink, Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { useTasks } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/tarefas', label: 'Tarefas', end: false },
]

export default function AppLayout() {
  const tasksState = useTasks()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="text-lg font-semibold">Task Tracker</span>
          <nav className="flex gap-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet context={tasksState} />
      </main>
      <Toaster richColors />
    </div>
  )
}