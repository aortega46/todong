import { Component, Input, inject } from '@angular/core'
import { Todo } from '../interfaces/todo'

import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { MatMenuModule } from '@angular/material/menu'
import { MatButtonModule } from '@angular/material/button'

import { UserInputComponent } from '../user-input/user-input.component'

import { MatTooltipModule } from '@angular/material/tooltip'
import { TabService } from '../services/tab.service'

@Component({
  selector: 'todo-item',
  standalone: true,
  imports: [
    MatCheckboxModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    UserInputComponent,
    MatTooltipModule,
  ],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss',
})
export class TodoItemComponent {
  @Input() todo!: Todo
  @Input() parentId?: string

  tabService = inject(TabService)

  isAddingSubTodo: boolean = false

  toggleStatus() {
    const newTodo: Todo = {
      ...this.todo,
      status: this.todo.status == 'Not started' ? 'Done' : 'Not started',
    }

    this.parentId
      ? this.tabService.updateSubTaskTab(newTodo, this.parentId)
      : this.tabService.updateTaskTab(newTodo)
  }

  deleteTodo() {
    this.tabService.deleteTaskFromTab(this.todo.id)
  }

  deleteSubTodo() {
    if (!this.parentId) return
    this.tabService.deleteSubTaskFromTab(this.todo.id, this.parentId)
  }

  toggleAddSubTodo() {
    this.isAddingSubTodo = !this.isAddingSubTodo
  }
}
