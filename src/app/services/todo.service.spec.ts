import { TestBed } from '@angular/core/testing'

import { TodoService } from './todo.service'
import { Todo } from '../interfaces/todo'
import { take, tap } from 'rxjs'

const todoListMock: Todo[] = [
  {
    id: 'task1',
    title: 'Task 1',
    status: 'Not started',
    date: '7/3/2024',
    subtasks: [{ id: 'task3', title: 'Task 3', status: 'Not started' }],
  },
  { id: 'task2', title: 'Task 2', status: 'Not started' },
]

const todoMock: Todo = {
  id: 'mockTodo1',
  title: 'mockTodo1',
  status: 'Not started',
}

describe('TodoService', () => {
  let service: TodoService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(TodoService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should return if title not provided #addTodo', () => {
    const spyAddTodo = spyOn(service, 'addTodo')

    const res = service.addTodo({ title: 'a' })

    expect(res).toBeUndefined()
    expect(spyAddTodo).toHaveBeenCalled()
  })

  it('should #addTodo', () => {
    service.addTodo({ title: todoMock.title })

    service.todoList$.pipe(take(1)).subscribe(list => {
      const todo = list.filter(todo => todo.title === todoMock.title)[0]

      expect(todo).toBeDefined()
      expect(todo.title).toEqual(todoMock.title)
    })
  })

  it('should #updateTodo', () => {
    service.addTodo({ title: 'Task 1' })

    let todoInitial: Todo
    service.todoList$.pipe(take(1)).subscribe(list => (todoInitial = list[0]))

    const newTodo: Todo = {
      ...todoInitial!,
      status: 'Done',
    }

    expect(todoInitial!.status).toBe('Not started')

    service.updateTodo(newTodo)

    let todoUpdated: Todo
    service.todoList$.pipe(take(1)).subscribe(list => (todoUpdated = list[0]))

    expect(todoUpdated!.status).toBe('Done')
    expect(todoUpdated!.title).toBe('Task 1')
    expect(todoUpdated!.id).toBe(todoInitial!.id)
  })

  it('should return if id not found updateTodo', () => {
    const todo: Todo = {
      id: 'task1',
      title: '',
      status: 'Not started',
    }
    const res = service.updateTodo(todo)

    expect(res).toBeUndefined()
  })

  it('should #deleteTodo', () => {
    const mockTodo: Todo = {
      id: 'task1',
      title: 'Task 1',
      status: 'Not started',
    }
    service['todoList'].next([mockTodo])

    service.deleteTodo(mockTodo.id)

    service.todoList$
      .pipe(take(1))
      .subscribe(list => expect(list.length).toBe(0))
  })

  it('should return Todo #findTodoById', () => {
    const mockTodo: Todo = {
      id: 'task1',
      title: 'Task 1',
      status: 'Not started',
    }
    service['todoList'].next([mockTodo])

    const res = service.findTodoById('task1')
    expect(res?.id).toBe(mockTodo.id)
  })

  it('should return undefined #findTodoById', () => {
    const res = service.findTodoById('testundefined')
    expect(res).toBeUndefined()
  })

  it('should #addSubTask', () => {
    const mockTodo: Todo = {
      id: 'task1',
      title: 'Task 1',
      status: 'Not started',
    }
    service['todoList'].next([mockTodo])

    service.addSubTask({ title: 'Subtask1', parentId: 'task1' })

    service.todoList$.pipe(take(1)).subscribe(list => {
      const todo = list[0]

      expect(todo.subtasks).toBeDefined()
      expect(todo.subtasks?.length).toBe(1)
    })
  })

  it('should #updateSubTask', () => {
    const mockSubtask: Todo = {
      id: 'subtask1',
      title: 'Subtask 1',
      status: 'Not started',
    }

    const mockTodo: Todo = {
      id: 'task1',
      title: 'Task 1',
      status: 'Not started',
      subtasks: [mockSubtask],
    }
    service['todoList'].next([mockTodo])

    service.updateSubTask({ ...mockSubtask, status: 'Done' }, 'task1')

    service.todoList$.pipe(take(1)).subscribe(list => {
      const todo = list[0]
      const subtask = todo.subtasks![0]

      expect(todo.subtasks).toBeDefined()
      expect(todo.subtasks?.length).toBe(1)
      expect(subtask.status).toBe('Done')
    })
  })

  it('should #deleteSubTask', () => {
    const mockTodo: Todo = {
      id: 'task1',
      title: 'Task 1',
      status: 'Not started',
      subtasks: [{ id: 'subtask1', title: 'Subtask 1', status: 'Done' }],
    }
    service['todoList'].next([mockTodo])

    service.deleteSubTask(mockTodo.subtasks![0].id, mockTodo.id)

    service.todoList$.pipe(take(1)).subscribe(list => {
      const todo = list[0]

      expect(todo.subtasks).toBeDefined()
      expect(todo.subtasks?.length).toBe(0)
    })
  })
})
