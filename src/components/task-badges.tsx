import { Badge } from '@/components/ui/badge'
import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/task-labels'
import type { TaskPriority, TaskStatus } from '@/types/task'

const priorityVariant = {
  baixa: 'secondary',
  media: 'outline',
  alta: 'destructive',
} as const satisfies Record<TaskPriority, 'secondary' | 'outline' | 'destructive'>

const statusVariant = {
  pendente: 'outline',
  em_andamento: 'secondary',
  concluida: 'default',
} as const satisfies Record<TaskStatus, 'outline' | 'secondary' | 'default'>

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge variant={priorityVariant[priority]}>{PRIORITY_LABELS[priority]}</Badge>
}

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge variant={statusVariant[status]}>{STATUS_LABELS[status]}</Badge>
}