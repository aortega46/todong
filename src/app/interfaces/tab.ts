import { TodoService } from '../services/todo.service'

export interface Tab {
  id: string
  name: string
  todo: TodoService
}
