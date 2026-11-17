import type { TaskPriority, TaskStatus } from '@/types/task'

export const STATUS_LABELS: Record<TaskStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
}

export function formatDueDate(value: string | null): string {
  if (!value) return 'Sem prazo'
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}