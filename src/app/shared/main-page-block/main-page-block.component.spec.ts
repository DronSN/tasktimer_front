import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPageBlockComponent } from './main-page-block.component';

describe('MainPageBlockComponent', () => {
  let component: MainPageBlockComponent;
  let fixture: ComponentFixture<MainPageBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainPageBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainPageBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
