import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import {provideRouter} from '@angular/router';

import { ImportDVDComponent } from './import-dvd.component';

describe('ImportDVDComponent', () => {
  let component: ImportDVDComponent;
  let fixture: ComponentFixture<ImportDVDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatListModule, ImportDVDComponent],
      providers: [
        provideRouter([]),
      ]
    }).compileComponents();
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
