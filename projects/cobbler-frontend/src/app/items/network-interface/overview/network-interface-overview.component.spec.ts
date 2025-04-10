import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkInterfaceOverviewComponent } from './network-interface-overview.component';

describe('OverviewComponent', () => {
  let component: NetworkInterfaceOverviewComponent;
  let fixture: ComponentFixture<NetworkInterfaceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkInterfaceOverviewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkInterfaceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
