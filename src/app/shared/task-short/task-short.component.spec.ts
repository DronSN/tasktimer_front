import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskShortComponent } from './task-short.component';

describe('TaskShortComponent', () => {
  let component: TaskShortComponent;
  let fixture: ComponentFixture<TaskShortComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskShortComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskShortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
