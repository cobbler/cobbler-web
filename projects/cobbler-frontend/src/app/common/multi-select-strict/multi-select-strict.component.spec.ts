import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiSelectStrictComponent } from './multi-select-strict.component';

describe('MultiSelectStrictComponent', () => {
  let component: MultiSelectStrictComponent;
  let fixture: ComponentFixture<MultiSelectStrictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelectStrictComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelectStrictComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
