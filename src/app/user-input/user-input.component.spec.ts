import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserInputComponent } from './user-input.component'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TodoService } from '../services/todo.service'

describe('UserInputComponent', () => {
  let component: UserInputComponent
  let fixture: ComponentFixture<UserInputComponent>
  let todoService: TodoService

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInputComponent, BrowserAnimationsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(UserInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()

    todoService = TestBed.inject(TodoService)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should #addTodo', () => {
    const spyAddTodo = spyOn(todoService, 'addTodo')
    const spyReset = spyOn(component.myTodo, 'reset')

    component.myTodo.patchValue({ title: 'task1' })

    component.addTodo()

    expect(spyAddTodo).toHaveBeenCalled()
    const args = spyAddTodo.calls.mostRecent().args[0] as unknown
    expect(args).toEqual({ title: 'task1', date: '' })
    expect(spyReset).toHaveBeenCalled()
  })

  it('should return if no title #addTodo', () => {
    component.myTodo.patchValue({ title: '' })

    const res = component.addTodo()
    expect(res).toBeUndefined()
  })

  it('should #addSubTask', () => {
    const spyAddSubTask = spyOn(todoService, 'addSubTask')
    const spyReset = spyOn(component.myTodo, 'reset')

    component.myTodo.patchValue({ title: 'task1' })

    component.parentId = 'fakeId'

    component.addSubTask()
    expect(spyAddSubTask).toHaveBeenCalled()
    const args = spyAddSubTask.calls.mostRecent().args[0] as unknown
    expect(args).toEqual({
      title: 'task1',
      date: '',
      parentId: component.parentId,
    })
    expect(spyReset).toHaveBeenCalled()
  })

  it('should return if no title #addSubTask', () => {
    component.myTodo.patchValue({ title: '' })

    const res = component.addSubTask()
    expect(res).toBeUndefined()
  })
})
