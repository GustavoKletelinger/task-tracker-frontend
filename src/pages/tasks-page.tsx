import { useState } from 'react'
import { toast } from 'sonner'
import { PriorityBadge, StatusBadge } from '@/components/task-badges'
import { TaskFormDialog } from '@/components/task-form-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useTasksContext } from '@/hooks/use-tasks-context'
import { getErrorMessage } from '@/lib/errors'
import { formatDueDate } from '@/lib/task-labels'
import type { Task, TaskInput } from '@/types/task'

export default function TasksPage() {
  const { tasks, loading, error, reload, addTask, editTask, removeTask } = useTasksContext()
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | null>(null)
  const [toDelete, setToDelete] = useState<Task | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditing(task)
    setFormOpen(true)
  }

  const handleSave = async (input: TaskInput): Promise<void> => {
    try {
      if (editing) {
        await editTask(editing.id, input)
        toast.success('Tarefa atualizada com sucesso.')
      } else {
        await addTask(input)
        toast.success('Tarefa cadastrada com sucesso.')
      }
      setFormOpen(false)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Não foi possível salvar a tarefa.'))
      throw err
    }
  }

  const confirmDelete = async (): Promise<void> => {
    if (!toDelete) return
    setDeleteBusy(true)
    try {
      await removeTask(toDelete.id)
      toast.success('Tarefa excluída com sucesso.')
      setToDelete(null)
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, 'Não foi possível excluir a tarefa.'))
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Tarefas</h1>
          <p className="text-sm text-muted-foreground">
            Cadastre, edite e exclua as suas tarefas
          </p>
        </div>
        <Button onClick={openCreate}>Nova tarefa</Button>
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
      ) : loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((key) => (
            <Skeleton key={key} className="h-12 w-full" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Nenhuma tarefa cadastrada</CardTitle>
            <CardDescription>
              Clique em &quot;Nova tarefa&quot; para cadastrar a primeira.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={openCreate}>Cadastrar tarefa</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarefa</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-xs text-muted-foreground">{task.description}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={task.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={task.priority} />
                  </TableCell>
                  <TableCell>{formatDueDate(task.dueDate)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEdit(task)}>
                        Editar
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => setToDelete(task)}>
                        Excluir
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <TaskFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        task={editing}
        onSubmit={handleSave}
      />

      <Dialog
        open={toDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleteBusy) setToDelete(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir tarefa</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a tarefa <strong>{toDelete?.title}</strong>? Essa ação
              não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)} disabled={deleteBusy}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteBusy}>
              {deleteBusy ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}