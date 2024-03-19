import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, map } from 'rxjs'
import { Tab } from '../interfaces/tab'
import { TodoService } from './todo.service'

import { v4 } from 'uuid'
import { Todo } from '../interfaces/todo'

const defaultTab: Tab = { id: v4(), name: 'Tasks', todo: new TodoService() }

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private tabList: BehaviorSubject<Tab[]>
  tabList$: Observable<Tab[]>

  selectedTabIndex = new BehaviorSubject<number>(0)
  private selectedTodo?: TodoService

  constructor() {
    const tabs = this.loadFromLocalStorage()
    this.tabList = new BehaviorSubject<Tab[]>(tabs)
    this.tabList$ = this.tabList.asObservable()

    this.selectedTabIndex.subscribe(
      index => (this.selectedTodo = this.tabList.getValue()[index].todo)
    )
  }

  getTabTodoList(id: string): Observable<Tab> {
    return this.tabList$.pipe(map(res => res.filter(tab => tab.id === id)[0]))
  }

  getTabTodoServiceByIndex(index: number) {
    return this.tabList.getValue()[index].todo
  }

  addTab(name: string) {
    if (!name) return

    const newTab: Tab = {
      id: v4(),
      name: name,
      todo: new TodoService(),
    }

    const currentTabs = this.tabList.getValue()
    this.tabList.next([...currentTabs, newTab])

    this.updateLocalStorage()
  }

  removeTab(id: string) {
    const currentTabs = this.tabList.getValue()
    const newTabs = currentTabs.filter(tab => tab.id !== id)

    this.tabList.next(newTabs)

    this.updateLocalStorage()
  }

  addTaskToTab({ title, date }: { title: string; date?: Date }) {
    this.selectedTodo?.addTodo({ title, date })
    this.updateLocalStorage()
  }

  addSubTaskToTab({
    title,
    date,
    parentId,
  }: {
    title: string
    date?: Date
    parentId: string
  }) {
    this.selectedTodo?.addSubTask({ title, date, parentId: parentId })
    this.updateLocalStorage()
  }

  updateTaskTab(todo: Todo) {
    this.selectedTodo?.updateTodo(todo)
    this.updateLocalStorage()
  }

  updateSubTaskTab(todo: Todo, parentId: string) {
    this.selectedTodo?.updateSubTask(todo, parentId)
    this.updateLocalStorage()
  }

  deleteTaskFromTab(id: string) {
    this.selectedTodo?.deleteTodo(id)
    this.updateLocalStorage()
  }

  deleteSubTaskFromTab(id: string, parentId: string) {
    this.selectedTodo?.deleteSubTask(id, parentId)
    this.updateLocalStorage()
  }

  toSerializableObject() {
    const current = this.tabList.getValue()
    const serializableTabs = current.map(tab => ({
      id: tab.id,
      name: tab.name,
      todo: tab.todo.toSerializableObject(),
    }))

    return serializableTabs
  }

  loadFromLocalStorage(): Tab[] {
    const localList = localStorage.getItem('tabList')
    const initialTabs = localList ? JSON.parse(localList) : [defaultTab]

    return initialTabs.map(
      (tab: { id: string; name: string; todo: Todo[] }) => ({
        id: tab,
        name: tab.name,
        todo: TodoService.fromSerializableObject(tab.todo),
      })
    )
  }

  updateLocalStorage() {
    const serializedTabs = this.toSerializableObject()
    localStorage.setItem('tabList', JSON.stringify(serializedTabs))
  }
}
