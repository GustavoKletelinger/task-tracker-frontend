import { useTasksContext } from '@/hooks/use-tasks-context'

export default function TasksPage() {
  const { tasks, loading, error } = useTasksContext()

  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Tarefas</h1>
      <p className="text-muted-foreground">
        {loading ? 'Carregando...' : (error ?? `${tasks.length} tarefa(s) carregada(s)`)}
      </p>
    </div>
  )
}