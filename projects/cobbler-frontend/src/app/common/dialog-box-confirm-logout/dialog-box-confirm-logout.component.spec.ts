import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogBoxConfirmLogoutComponent } from './dialog-box-confirm-logout.component';

describe('DialogBoxConfirmLogoutComponent', () => {
  let component: DialogBoxConfirmLogoutComponent;
  let fixture: ComponentFixture<DialogBoxConfirmLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogBoxConfirmLogoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogBoxConfirmLogoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
