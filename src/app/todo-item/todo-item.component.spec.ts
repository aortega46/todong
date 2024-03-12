import { ComponentFixture, TestBed } from '@angular/core/testing'

import { TodoItemComponent } from './todo-item.component'
import { Todo } from '../interfaces/todo'
import { TodoService } from '../services/todo.service'

const todoMock: Todo = {
  id: 'task1',
  title: 'Task 1',
  status: 'Not started',
}

class MockTodoService {
  updateTodo() {}
  deleteTodo() {}
  deleteSubTask() {}
}

describe('TodoItemComponent', () => {
  let component: TodoItemComponent
  let fixture: ComponentFixture<TodoItemComponent>
  let todoService: TodoService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoItemComponent],
      // providers: [{ provide: TodoService, useClass: MockTodoService }],
    }).compileComponents()

    fixture = TestBed.createComponent(TodoItemComponent)
    component = fixture.componentInstance
    component.todo = todoMock

    fixture.detectChanges()

    todoService = TestBed.inject(TodoService)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should #toggleStatus to Done', () => {
    const spyUpdateTodo = spyOn(todoService, 'updateTodo').and.callThrough()

    component.toggleStatus()

    expect(spyUpdateTodo).toHaveBeenCalledWith({
      ...todoMock,
      status: 'Done',
    })
  })

  it('should #toggleStatus to Not started', () => {
    const spyUpdateTodo = spyOn(todoService, 'updateTodo').and.callThrough()

    component.todo = { ...todoMock, status: 'Done' }

    component.toggleStatus()

    expect(spyUpdateTodo).toHaveBeenCalledWith({
      ...todoMock,
      status: 'Not started',
    })
  })

  it('should #deleteTodo', () => {
    const spyDeleteTodo = spyOn(todoService, 'deleteTodo')

    component.deleteTodo()
    expect(spyDeleteTodo).toHaveBeenCalledWith(todoMock.id)
  })

  it('should #deleteSubTodo', () => {
    component.parentId = 'task2'
    const spyDeleteSubTodo = spyOn(todoService, 'deleteSubTask')

    component.deleteSubTodo()

    expect(spyDeleteSubTodo).toHaveBeenCalledWith(
      todoMock.id,
      component.parentId
    )
  })

  it('should return if parentId not provided #deleteSubTodo', () => {
    const res = component.deleteSubTodo()
    expect(res).toBeUndefined()
  })

  it('should #toggleAddSubTodo', () => {
    expect(component.isAddingSubTodo).toBeFalse()
    component.toggleAddSubTodo()
    expect(component.isAddingSubTodo).toBeTrue()
    component.toggleAddSubTodo()
    expect(component.isAddingSubTodo).toBeFalse()
  })
})
