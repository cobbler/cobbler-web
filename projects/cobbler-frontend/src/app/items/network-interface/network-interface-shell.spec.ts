import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkInterfaceShellComponent } from './network-interface-shell.component';

describe('NetworkInterfaceShellComponent', () => {
  let component: NetworkInterfaceShellComponent;
  let fixture: ComponentFixture<NetworkInterfaceShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkInterfaceShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkInterfaceShellComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(NetworkInterfaceShellComponent).toBeTruthy();
  });
});
