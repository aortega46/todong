import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TodoItemComponent } from './todo-item.component'
import { Todo } from '../interfaces/todo'

const todoMock: Todo = {
  id: 'task1',
  title: 'Task 1',
  status: 'Not started',
}

describe('TodoItemComponent', () => {
  let component: TodoItemComponent
  let fixture: ComponentFixture<TodoItemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(TodoItemComponent)
    component = fixture.componentInstance

    component.todo = todoMock
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
