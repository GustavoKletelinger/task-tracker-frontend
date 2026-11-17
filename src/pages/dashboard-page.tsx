import { useTasksContext } from '@/hooks/use-tasks-context'

export default function DashboardPage() {
  const { tasks, loading, error } = useTasksContext()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-muted-foreground">
        {loading ? 'Carregando...' : (error ?? `${tasks.length} tarefa(s) carregada(s)`)}
      </p>
    </div>
  )
}