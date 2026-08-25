import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionGroupComponent } from './option-group.component';

@Component({
  imports: [OptionGroupComponent],
  template: `
    <cobbler-option-group label="Power Management">
      <p class="projected-content">Projected field</p>
    </cobbler-option-group>
  `,
})
class HostComponent {}

describe('OptionGroupComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the label as the card title', () => {
    const title = fixture.nativeElement.querySelector('mat-card-title');
    expect(title.textContent).toContain('Power Management');
  });

  it('projects content into the card', () => {
    const projected = fixture.nativeElement.querySelector('.projected-content');
    expect(projected.textContent).toContain('Projected field');
  });
});
