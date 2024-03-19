import { Component, Input, inject } from '@angular/core'

import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'

import { MatDatepickerModule } from '@angular/material/datepicker'
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core'

import { TabService } from '../services/tab.service'

@Component({
  selector: 'user-input',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './user-input.component.html',
  styleUrl: './user-input.component.scss',
})
export class UserInputComponent {
  @Input() parentId?: string

  private tabService = inject(TabService)
  private fb = inject(FormBuilder)

  myTodo: FormGroup = this.fb.group({
    date: [''],
    title: [''],
  })

  constructor(private dateAdapter: DateAdapter<Date>) {
    this.dateAdapter.setLocale('es-ES')
  }

  addTodo() {
    const { title, date } = this.myTodo.value
    if (!title || this.myTodo.invalid) return

    this.tabService.addTaskToTab({ title, date })
    this.myTodo.reset()
  }

  addSubTask() {
    const { title, date } = this.myTodo.value
    if (!title || this.myTodo.invalid || !this.parentId) return

    this.tabService.addSubTaskToTab({ title, date, parentId: this.parentId })
    this.myTodo.reset()
  }
}
