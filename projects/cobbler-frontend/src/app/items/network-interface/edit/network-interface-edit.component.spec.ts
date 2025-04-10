import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkInterfaceEditComponent } from './network-interface-edit.component';

describe('EditComponent', () => {
  let component: NetworkInterfaceEditComponent;
  let fixture: ComponentFixture<NetworkInterfaceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkInterfaceEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkInterfaceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
