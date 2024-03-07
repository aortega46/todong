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
}
