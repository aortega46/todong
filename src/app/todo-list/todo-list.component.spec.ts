import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TodoListComponent } from './todo-list.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

describe('TodoListComponent', () => {
  let component: TodoListComponent
  let fixture: ComponentFixture<TodoListComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoListComponent, BrowserAnimationsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(TodoListComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
