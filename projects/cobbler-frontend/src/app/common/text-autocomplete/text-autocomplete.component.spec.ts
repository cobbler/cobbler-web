import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAutocompleteComponent } from './text-autocomplete.component';

describe('TextAutocompleteComponent', () => {
  let component: TextAutocompleteComponent;
  let fixture: ComponentFixture<TextAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextAutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextAutocompleteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
