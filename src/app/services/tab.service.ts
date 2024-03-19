import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { Tab } from '../interfaces/tab'

import { v4 } from 'uuid'

const defaultTab: Tab = { id: v4(), name: 'Tasks', todoIds: [] }

@Injectable({
  providedIn: 'root',
})
export class TabService {
  private tabList: BehaviorSubject<Tab[]>
  tabList$: Observable<Tab[]>

  private selectedTabIndex = new BehaviorSubject<number>(0)
  selectedTabIndex$ = this.selectedTabIndex.asObservable()

  constructor() {
    const localList = localStorage.getItem('tabList')
    const initialTabs = localList ? JSON.parse(localList) : [defaultTab]

    this.tabList = new BehaviorSubject<Tab[]>(initialTabs)
    this.tabList$ = this.tabList.asObservable()

    this.tabList$.subscribe(tabs => {
      this.updateLocalStorage(tabs)
    })
  }

  updateSelectedTabIndex(index: number) {
    this.selectedTabIndex.next(index)
  }

  addTab(name: string) {
    if (!name) return

    const newTab: Tab = {
      id: v4(),
      name: name,
      todoIds: [],
    }

    const currentTabs = this.tabList.getValue()
    this.tabList.next([...currentTabs, newTab])
  }

  removeTab(id: string) {
    const currentTabs = this.tabList.getValue()
    const newTabs = currentTabs.filter(tab => tab.id !== id)

    this.tabList.next(newTabs)
  }

  addTaskToTab(id: string) {
    const currentTabs = this.tabList.getValue()
    const updatedTabs = [...currentTabs]

    const selectedTab = updatedTabs[this.selectedTabIndex.value]
    selectedTab.todoIds.push(id)

    this.tabList.next(updatedTabs)
  }

  deleteTaskFromTab(id: string) {
    const currentTabs = this.tabList.getValue()
    const updatedTabs = [...currentTabs]

    const selectedTab = updatedTabs[this.selectedTabIndex.value]

    const newTabIds = selectedTab.todoIds.filter(todoId => todoId != id)
    selectedTab.todoIds = newTabIds

    this.tabList.next(updatedTabs)
  }

  updateLocalStorage(tabs: Tab[]) {
    localStorage.setItem('tabList', JSON.stringify(tabs))
  }
}
