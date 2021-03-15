import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDVDComponent } from './import-dvd.component';

describe('ImportDVDComponent', () => {
  let component: ImportDVDComponent;
  let fixture: ComponentFixture<ImportDVDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportDVDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDVDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
