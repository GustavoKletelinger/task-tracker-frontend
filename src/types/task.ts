export type TaskPriority = 'baixa' | 'media' | 'alta'
export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida'

export interface Task {
  id: number
  title: string
  description: string | null
  priority: TaskPriority
  status: TaskStatus
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  description?: string | null
  priority?: TaskPriority
  status?: TaskStatus
  dueDate?: string | null
}

export interface ApiError {
  message: string
  errors?: string[]
}