import { Link } from 'react-router-dom'
import { PriorityBadge, StatusBadge } from '@/components/task-badges'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useTasksContext } from '@/hooks/use-tasks-context'
import { formatDueDate } from '@/lib/task-labels'
import type { TaskStatus } from '@/types/task'

const summary: { label: string; status?: TaskStatus }[] = [
  { label: 'Total' },
  { label: 'Pendentes', status: 'pendente' },
  { label: 'Em andamento', status: 'em_andamento' },
  { label: 'Concluídas', status: 'concluida' },
]

export default function DashboardPage() {
  const { tasks, loading, error, reload } = useTasksContext()

  const countBy = (status?: TaskStatus): number =>
    status ? tasks.filter((task) => task.status === status).length : tasks.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral das suas tarefas</p>
        </div>
        <Button asChild>
          <Link to="/tarefas">Gerenciar tarefas</Link>
        </Button>
      </div>

      {error && !loading ? (
        <Card>
          <CardHeader>
            <CardTitle>Não foi possível carregar as tarefas</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={reload}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summary.map((item) => (
              <Card key={item.label}>
                <CardHeader>
                  <CardDescription>{item.label}</CardDescription>
                  {loading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    <CardTitle className="text-3xl">{countBy(item.status)}</CardTitle>
                  )}
                </CardHeader>
              </Card>
            ))}
          </section>

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((key) => (
                <Skeleton key={key} className="h-36 w-full" />
              ))}
            </div>
          ) : tasks.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Nenhuma tarefa por aqui</CardTitle>
                <CardDescription>
                  Cadastre sua primeira tarefa para começar a acompanhar seu trabalho.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link to="/tarefas">Cadastrar tarefa</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{task.title}</CardTitle>
                    <CardDescription>{task.description ?? 'Sem descrição'}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={task.status} />
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Prazo: {formatDueDate(task.dueDate)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}