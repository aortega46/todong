import { Component, inject } from '@angular/core'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { TodoService } from '../services/todo.service'
import { Todo } from '../interfaces/todo'

@Component({
  selector: 'user-input',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss',
})
export class UserInputComponent {
  taskTitle = ''

  todoService = inject(TodoService)

  addTodo() {
    this.todoService.addTodo(this.taskTitle)
    this.taskTitle = ''
  }
}
