import { useCallback, useEffect, useState } from 'react'
import { ApiRequestError, createTask, deleteTask, listTasks, updateTask } from '@/lib/api'
import type { Task, TaskInput } from '@/types/task'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    listTasks()
      .then((data) => {
        if (cancelled) return
        setTasks(data)
        setError(null)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof ApiRequestError ? err.message : 'Erro ao carregar as tarefas.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const reload = useCallback(() => {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }, [])

  const addTask = useCallback(async (input: TaskInput) => {
    const created = await createTask(input)
    setTasks((current) => [created, ...current])
  }, [])

  const editTask = useCallback(async (id: number, input: TaskInput) => {
    const updated = await updateTask(id, input)
    setTasks((current) => current.map((task) => (task.id === id ? updated : task)))
  }, [])

  const removeTask = useCallback(async (id: number) => {
    await deleteTask(id)
    setTasks((current) => current.filter((task) => task.id !== id))
  }, [])

  return { tasks, loading, error, reload, addTask, editTask, removeTask }
}