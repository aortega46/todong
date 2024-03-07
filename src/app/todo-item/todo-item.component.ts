import { Component, Input, ViewEncapsulation } from '@angular/core'
import { Todo } from '../interfaces/todo'

import { MatCheckboxModule } from '@angular/material/checkbox'

@Component({
  selector: 'todo-item',
  standalone: true,
  imports: [MatCheckboxModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  @Input() todo!: Todo

  toggleStatus() {
    this.todo.status = this.todo.status == 'Not started' ? 'Done' : 'Not started'
  }
}
