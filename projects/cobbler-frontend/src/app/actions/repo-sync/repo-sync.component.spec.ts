import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import {provideRouter} from '@angular/router';

import { RepoSyncComponent } from './repo-sync.component';


describe('RepoSyncComponent', () => {
  let component: RepoSyncComponent;
  let fixture: ComponentFixture<RepoSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatListModule, RepoSyncComponent],
      providers: [
        provideRouter([]),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepoSyncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
