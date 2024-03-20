import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, map } from 'rxjs'
import { Todo } from '../interfaces/todo'

import { v4 } from 'uuid'

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todoList: BehaviorSubject<Todo[]>
  todoList$: Observable<Todo[]>

  constructor() {
    const localList = localStorage.getItem('todoList')
    const initialTodo = localList ? JSON.parse(localList) : []
    this.todoList = new BehaviorSubject<Todo[]>(initialTodo)

    this.todoList$ = this.todoList.asObservable()
  }

  addTodo({ title, date }: { title: string; date?: Date }): string | undefined {
    if (!title) return

    const newTodo: Todo = {
      id: v4(),
      title: title,
      status: 'Not started',
      date: date ? date.toLocaleDateString('es-ES') : undefined,
    }

    const currentValue = this.todoList.getValue()
    this.todoList.next([newTodo, ...currentValue])
    this.updateLocalStorage()

    return newTodo.id
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
    this.updateLocalStorage()
  }

  deleteTodo(id: string) {
    const currentTodosList = this.todoList.getValue()
    const newTodosList = currentTodosList.filter(todo => todo.id !== id)

    this.todoList.next(newTodosList)
    this.updateLocalStorage()
  }

  findTodoById(id: string): Todo | undefined {
    return this.todoList.getValue().find(item => item.id === id)
  }

  addSubTask({
    title,
    date,
    parentId,
  }: {
    title: string
    date?: Date
    parentId: string
  }) {
    const parent = this.findTodoById(parentId)
    if (!parent || !title) return

    const newTodo: Todo = {
      id: v4(),
      title: title,
      status: 'Not started',
      date: date ? date.toLocaleDateString('es-ES') : undefined,
    }

    const newParent: Todo = {
      ...parent,
      subtasks: [newTodo, ...(parent.subtasks || [])],
    }

    this.updateTodo(newParent)
  }

  updateSubTask(todo: Todo, parentId: string) {
    const parent = this.findTodoById(parentId)
    if (!parent || !parent?.subtasks) return

    const { id } = todo

    const subTodoIndex = parent.subtasks.findIndex(todo => todo.id === id)
    if (subTodoIndex == -1) return

    const newSubTodoList = [
      ...parent.subtasks.slice(0, subTodoIndex),
      {
        ...todo,
      },
      ...parent.subtasks.slice(subTodoIndex + 1),
    ]

    const newParent: Todo = {
      ...parent,
      subtasks: newSubTodoList,
    }

    this.updateTodo(newParent)
  }

  deleteSubTask(id: string, parentId: string) {
    const parent = this.findTodoById(parentId)
    if (!parent) return

    const newTodo = {
      ...parent,
      subtasks: parent.subtasks?.filter(todo => todo.id !== id),
    }
    this.updateTodo(newTodo)
  }

  updateLocalStorage() {
    const current = this.todoList.getValue()
    localStorage.setItem('todoList', JSON.stringify(current))
  }

  getTodoByTabIds(tabIds: string[]): Observable<Todo[]> {
    return this.todoList$.pipe(
      map(todos => todos.filter(todo => tabIds.includes(todo.id)))
    )
  }
}
