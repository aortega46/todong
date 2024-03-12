import { Component, OnInit, inject } from '@angular/core'
import { TodoService } from '../services/todo.service'
import { AsyncPipe } from '@angular/common'
import { TodoItemComponent } from '../todo-item/todo-item.component'

import { MOTIVATIONAL_PHRASES } from '../constants/motivational-phrases'

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [AsyncPipe, TodoItemComponent],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit {
  todoService = inject(TodoService)

  phrase?: string

  ngOnInit() {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)
    this.phrase = MOTIVATIONAL_PHRASES[randomIndex]
  }
}
