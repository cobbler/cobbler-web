import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTemplatesComponent } from './app-templates.component';

describe('AppTemplatesComponent', () => {
  let component: AppTemplatesComponent;
  let fixture: ComponentFixture<AppTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppTemplatesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
