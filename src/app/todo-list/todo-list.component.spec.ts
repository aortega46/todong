import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TodoListComponent } from './todo-list.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { of } from 'rxjs'
import { TabService } from '../services/tab.service'
import { MatDialog } from '@angular/material/dialog'

describe('TodoListComponent', () => {
  let component: TodoListComponent
  let fixture: ComponentFixture<TodoListComponent>
  let dialog: MatDialog
  let tabService: TabService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent, BrowserAnimationsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(TodoListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    dialog = TestBed.inject(MatDialog)
    tabService = TestBed.inject(TabService)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should open a dialog and add a new tab', () => {
    const spyDialogOpen = spyOn(dialog, 'open')
    const spyTabService = spyOn(tabService, 'addTab')

    const newTabName = 'New tab'
    const dialogRefMock = jasmine.createSpyObj('MatDialogRef', {
      afterClosed: of(newTabName),
    })

    spyDialogOpen.and.returnValue(dialogRefMock)

    component.addNewTab()

    expect(spyDialogOpen).toHaveBeenCalled()
    expect(spyTabService).toHaveBeenCalledWith(newTabName)
  })

  it('should remove a tab', () => {
    const spyTabService = spyOn(tabService, 'removeTab')

    const mockId = 'testId'
    component.removeTab(mockId)

    expect(spyTabService).toHaveBeenCalledWith(mockId)
  })
})
