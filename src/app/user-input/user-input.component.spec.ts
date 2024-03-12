import { ComponentFixture, TestBed } from '@angular/core/testing'

import { UserInputComponent } from './user-input.component'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

describe('UserInputComponent', () => {
  let component: UserInputComponent
  let fixture: ComponentFixture<UserInputComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserInputComponent, BrowserAnimationsModule],
    }).compileComponents()

    fixture = TestBed.createComponent(UserInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
