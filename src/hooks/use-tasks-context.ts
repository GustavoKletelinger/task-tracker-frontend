import { useOutletContext } from 'react-router-dom'
import type { useTasks } from '@/hooks/use-tasks'

export type TasksContextValue = ReturnType<typeof useTasks>

export function useTasksContext(): TasksContextValue {
  return useOutletContext<TasksContextValue>()
}