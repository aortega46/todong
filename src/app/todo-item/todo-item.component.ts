import { Component, Input, inject } from '@angular/core'
import { Todo } from '../interfaces/todo'

import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'

import { TodoService } from '../services/todo.service'

@Component({
  selector: 'todo-item',
  standalone: true,
  imports: [MatCheckboxModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  @Input() todo!: Todo

  todoService = inject(TodoService)

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
}
