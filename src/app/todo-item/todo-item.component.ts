import { Component, Input, inject } from '@angular/core'
import { Todo } from '../interfaces/todo'

import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'

import { TodoService } from '../services/todo.service'
import { UserInputComponent } from '../user-input/user-input.component'

@Component({
  selector: 'todo-item',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    UserInputComponent,
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  @Input() todo!: Todo
  @Input() parentId?: string

  todoService = inject(TodoService)

  isAddingSubTodo: boolean = false

  toggleStatus() {
    const newTodo: Todo = {
      ...this.todo,
      status: this.todo.status == 'Not started' ? 'Done' : 'Not started',
    }
    this.todoService.updateTodo(newTodo)
  }

  deleteTodo() {
    this.todoService.deleteTodo(this.todo.id)
  }

  deleteSubTodo() {
    if (!this.parentId) return
    this.todoService.deleteSubTask(this.todo.id, this.parentId)
  }

  toggleAddSubTodo() {
    this.isAddingSubTodo = !this.isAddingSubTodo
  }
}
