import { Component, OnDestroy, OnInit, inject } from '@angular/core'
import { AsyncPipe } from '@angular/common'
import {
  Observable,
  Subject,
  takeUntil,
  tap,
  combineLatest,
  of,
  share,
  shareReplay,
} from 'rxjs'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatTabsModule } from '@angular/material/tabs'
import { MatDialog } from '@angular/material/dialog'

import { DialogComponent } from './dialog/dialog.component'
import { TodoItemComponent } from '../todo-item/todo-item.component'
import { MOTIVATIONAL_PHRASES } from '../constants/motivational-phrases'

import { Todo } from '../interfaces/todo'
import { TodoService } from '../services/todo.service'
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
export class TodoListComponent implements OnInit, OnDestroy {
  todoService = inject(TodoService)
  tabService = inject(TabService)

  phrase?: string

  selectedTabIndex$: Observable<number> = of(0)
  todos$: Observable<Todo[]> = new Observable<Todo[]>()

  private unsuscribe$ = new Subject<void>()

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    const selectedTabIndex$ = this.tabService.selectedTabIndex$.pipe(share())

    combineLatest([selectedTabIndex$, this.tabService.tabList$])
      .pipe(
        takeUntil(this.unsuscribe$),
        tap(([index]) => (this.selectedTabIndex$ = of(index)))
      )
      .subscribe(([index, tabs]) => {
        // being subscribed to the tabList$ and deleting one, it emits the new tabs before the index changes
        // therefore the tab[index] no longer exists and it is necessary to consider that
        const tabIds = tabs[index]?.todoIds

        if (tabIds)
          this.todos$ = this.todoService
            .getTodoByTabIds(tabIds)
            .pipe(shareReplay(1))
      })

    this.motivationalPhrase()
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next()
    this.unsuscribe$.complete()
  }

  motivationalPhrase() {
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
