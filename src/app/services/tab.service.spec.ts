import { TestBed } from '@angular/core/testing'

import { TabService } from './tab.service'
import { firstValueFrom, lastValueFrom, take } from 'rxjs'

describe('TabService', () => {
  let service: TabService

  beforeEach(() => {
    localStorage.clear()

    TestBed.configureTestingModule({})
    service = TestBed.inject(TabService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should #updateSelectedTabIndex', async () => {
    // Arrange
    const initialIndex = await lastValueFrom(
      service.selectedTabIndex$.pipe(take(1))
    )
    expect(initialIndex).toBe(0)

    // Act
    service.updateSelectedTabIndex(1)

    // Assert
    const updatedIndex = await lastValueFrom(
      service.selectedTabIndex$.pipe(take(1))
    )
    expect(updatedIndex).toBe(1)
  })

  it('should #addTab', async () => {
    const mockTabName = 'New tab'

    const initialTabs = await firstValueFrom(service.tabList$.pipe(take(1)))
    expect(initialTabs.length).toBe(1)

    service.addTab(mockTabName)

    const updatedTabs = await lastValueFrom(service.tabList$.pipe(take(1)))
    expect(updatedTabs.length).toBe(2)
    expect(updatedTabs[1].name).toBe(mockTabName)
  })

  it('should return if no name provided #addTab', () => {
    const res = service.addTab('')

    service.tabList$.pipe(take(1)).subscribe(tabs => {
      expect(tabs.length).toBe(1)
    })

    expect(res).toBeUndefined()
  })

  it('should #removeTab', async () => {
    const mockTabName = 'New tab'
    service.addTab(mockTabName)

    const initialTabs = await lastValueFrom(service.tabList$.pipe(take(1)))
    const idToRemove = initialTabs[1].id

    service.removeTab(idToRemove)

    const updatedTabs = await lastValueFrom(service.tabList$.pipe(take(1)))
    expect(updatedTabs.length).toBe(1)
  })

  it('should #addTaskToTab to default tab', () => {
    const mockId = 'testID'

    service.addTaskToTab(mockId)

    service.tabList$.pipe(take(1)).subscribe(tabs => {
      const tabIds = tabs[0].todoIds

      expect(tabIds).toContain(mockId)
      expect(tabIds.length).toBeGreaterThan(0)
    })
  })

  it('should #addTaskToTab to new tab', () => {
    const mockId = 'testID'
    const mockTabName = 'New tab'
    const index = 1

    service.addTab(mockTabName)
    service.updateSelectedTabIndex(index)
    service.addTaskToTab(mockId)

    service.tabList$.pipe(take(1)).subscribe(tabs => {
      const tabIds = tabs[index].todoIds

      expect(tabIds).toContain(mockId)
      expect(tabIds.length).toBeGreaterThan(0)
    })
  })

  it('should return if no id provided #addTaskToTab', () => {
    const res = service.addTaskToTab('')

    service.tabList$.pipe(take(1)).subscribe(tabs => {
      expect(tabs[0].todoIds.length).toBe(0)
    })

    expect(res).toBeUndefined()
  })

  it('should #deleteTaskFromTab from default tab', () => {
    const mockId = 'testID'

    service.addTaskToTab(mockId)
    service.deleteTaskFromTab(mockId)

    service.tabList$.pipe(take(1)).subscribe(tabs => {
      const tabIds = tabs[0].todoIds

      expect(tabIds.length).toBe(0)
    })
  })

  it('should #deleteTaskFromTab from new tab', () => {
    const mockId = 'testID'
    const mockTabName = 'New tab'
    const index = 1

    service.addTab(mockTabName)
    service.updateSelectedTabIndex(index)

    service.addTaskToTab(mockId)
    service.deleteTaskFromTab(mockId)

    service.tabList$.pipe(take(1)).subscribe(tabs => {
      const tabIds = tabs[index].todoIds

      expect(tabIds.length).toBe(0)
    })
  })
})
