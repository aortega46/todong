import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Todo } from '../interfaces/todo'

import { v4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todoList = new BehaviorSubject<Todo[]>([
    { id: 'task1', title: 'Task 1', status: 'Not started' },
    { id: 'task2', title: 'Task 2', status: 'Not started' },
  ])
  todoList$ = this.todoList.asObservable()

  addTodo(taskTitle: string) {
    const newTodo: Todo = {
      id: v4(),
      title: taskTitle,
      status: 'Not started',
    }

    const currentValue = this.todoList.getValue()
    this.todoList.next([...currentValue, newTodo])
  }

  updateTodo(todo: Todo) {
    const { id } = todo

    const todoIndex = this.todoList.getValue().findIndex(todo => todo.id === id)
    if (todoIndex === -1) return

    const currentTodosList = this.todoList.getValue()
    const newTodosList = [
      ...currentTodosList.slice(0, todoIndex),
      {
        ...currentTodosList[todoIndex],
        ...todo,
      },
      ...currentTodosList.slice(todoIndex + 1),
    ]

    this.todoList.next(newTodosList)
  }
}
