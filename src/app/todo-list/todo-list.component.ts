import { Component, OnInit, inject } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import { TodoItemComponent } from '../todo-item/todo-item.component'
import { MatTabsModule } from '@angular/material/tabs'

import { MOTIVATIONAL_PHRASES } from '../constants/motivational-phrases'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'

import { MatDialog } from '@angular/material/dialog'
import { DialogComponent } from './dialog/dialog.component'
import { TabService } from '../services/tab.service'

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [
    AsyncPipe,
    TodoItemComponent,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.scss',
})
export class TodoListComponent implements OnInit {
  tabService = inject(TabService)

  phrase?: string

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)
    this.phrase = MOTIVATIONAL_PHRASES[randomIndex]
  }

  addNewTab() {
    const dialogRef = this.dialog.open(DialogComponent, { data: {} })

    dialogRef.afterClosed().subscribe(newTabName => {
      if (newTabName) this.tabService.addTab(newTabName)
    })
  }

  removeTab(id: string) {
    this.tabService.removeTab(id)
  }
}
