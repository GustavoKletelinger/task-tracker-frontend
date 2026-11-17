import type { ApiError, Task, TaskInput } from '@/types/task'

const API_URL: string = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(
  /\/+$/,
  '',
)

export class ApiRequestError extends Error {
  readonly status: number
  readonly details: string[]

  constructor(message: string, status: number, details: string[] = []) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.details = details
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    throw new ApiRequestError('Não foi possível conectar à API. Tente novamente em instantes.', 0)
  }

  const body: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const apiError = body as Partial<ApiError> | null
    throw new ApiRequestError(
      apiError?.message ?? 'Erro inesperado ao se comunicar com a API.',
      response.status,
      apiError?.errors ?? [],
    )
  }

  return body as T
}

export function listTasks(): Promise<Task[]> {
  return request<Task[]>('/tasks')
}

export function createTask(input: TaskInput): Promise<Task> {
  return request<Task>('/tasks', { method: 'POST', body: JSON.stringify(input) })
}

export function updateTask(id: number, input: TaskInput): Promise<Task> {
  return request<Task>(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(input) })
}

export async function deleteTask(id: number): Promise<void> {
  await request<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' })
}