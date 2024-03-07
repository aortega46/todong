import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Todo } from '../interfaces/todo'

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todoList = new BehaviorSubject<Todo[]>([
    { title: 'Task 1', status: 'Not started' },
    { title: 'Task 2', status: 'Not started' },
  ])
  todoList$ = this.todoList.asObservable()

  addTodo(todo: Todo) {
    const currentValue = this.todoList.getValue()
    this.todoList.next([...currentValue, todo])
  }
}
