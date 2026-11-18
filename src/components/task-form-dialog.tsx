import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getErrorMessage } from '@/lib/errors'
import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/task-labels'
import type { Task, TaskInput, TaskPriority, TaskStatus } from '@/types/task'

const PRIORITIES = Object.keys(PRIORITY_LABELS) as TaskPriority[]
const STATUSES = Object.keys(STATUS_LABELS) as TaskStatus[]

interface TaskFormProps {
  task: Task | null
  onSubmit: (input: TaskInput) => Promise<void>
  onCancel: () => void
}

function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [priority, setPriority] = useState<TaskPriority>(task?.priority ?? 'media')
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'pendente')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()

    const trimmedTitle = title.trim()
    if (trimmedTitle === '') {
      setFormError('Informe o título da tarefa.')
      return
    }

    setSaving(true)
    setFormError(null)

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() === '' ? null : description.trim(),
        priority,
        status,
        dueDate: dueDate === '' ? null : dueDate,
      })
    } catch (err: unknown) {
      setFormError(getErrorMessage(err, 'Não foi possível salvar a tarefa.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="task-title">Título</Label>
        <Input
          id="task-title"
          value={title}
          maxLength={120}
          placeholder="Ex.: Estudar React Router"
          onChange={(event: ChangeEvent<HTMLInputElement>) => setTitle(event.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="task-description">Descrição</Label>
        <Textarea
          id="task-description"
          value={description}
          placeholder="Detalhes opcionais"
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="task-priority">Prioridade</Label>
          <Select value={priority} onValueChange={(value: string) => setPriority(value as TaskPriority)}>
            <SelectTrigger id="task-priority" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((item) => (
                <SelectItem key={item} value={item}>
                  {PRIORITY_LABELS[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="task-status">Status</Label>
          <Select value={status} onValueChange={(value: string) => setStatus(value as TaskStatus)}>
            <SelectTrigger id="task-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((item) => (
                <SelectItem key={item} value={item}>
                  {STATUS_LABELS[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="task-due-date">Prazo</Label>
        <Input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={(event: ChangeEvent<HTMLInputElement>) => setDueDate(event.target.value)}
        />
      </div>

      {formError && (
        <p role="alert" className="text-sm text-destructive">
          {formError}
        </p>
      )}

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Salvando...' : task ? 'Salvar alterações' : 'Cadastrar tarefa'}
        </Button>
      </DialogFooter>
    </form>
  )
}

interface TaskFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onSubmit: (input: TaskInput) => Promise<void>
}

export function TaskFormDialog({ open, onOpenChange, task, onSubmit }: TaskFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task ? 'Editar tarefa' : 'Nova tarefa'}</DialogTitle>
          <DialogDescription>
            {task
              ? 'Altere os dados da tarefa e salve.'
              : 'Preencha os dados para cadastrar uma nova tarefa.'}
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          key={task?.id ?? 'new'}
          task={task}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}