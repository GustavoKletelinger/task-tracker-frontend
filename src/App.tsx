import { Route, Routes } from 'react-router-dom'
import AppLayout from '@/components/app-layout'
import DashboardPage from '@/pages/dashboard-page'
import TasksPage from '@/pages/tasks-page'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/tarefas" element={<TasksPage />} />
      </Route>
    </Routes>
  )
}