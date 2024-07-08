import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import {provideRouter} from '@angular/router';

import { SnippetsComponent } from './snippets.component';


describe('SnippetsComponent', () => {
  let component: SnippetsComponent;
  let fixture: ComponentFixture<SnippetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnippetsComponent, MatListModule],
      providers: [
        provideRouter([]),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnippetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
