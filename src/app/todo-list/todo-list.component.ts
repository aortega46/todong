import { Component, inject } from '@angular/core'
import { TodoService } from '../services/todo.service'
import { AsyncPipe } from '@angular/common'
import { TodoItemComponent } from '../todo-item/todo-item.component'

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [AsyncPipe, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent {
  todoService = inject(TodoService)
}
