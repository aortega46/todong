import { Component, Input, ViewEncapsulation, inject } from '@angular/core'
import { Todo } from '../interfaces/todo'

import { MatCheckboxModule } from '@angular/material/checkbox'
import { TodoService } from '../services/todo.service'

@Component({
  selector: 'todo-item',
  standalone: true,
  imports: [MatCheckboxModule],
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
}
