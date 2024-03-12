export interface Todo {
  id: string
  title: string
  status: 'Not started' | 'In progress' | 'Done'
  date?: string
  subtasks?: Todo[]
}
