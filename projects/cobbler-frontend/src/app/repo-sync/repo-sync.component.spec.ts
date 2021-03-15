import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepoSyncComponent } from './repo-sync.component';

describe('RepoSyncComponent', () => {
  let component: RepoSyncComponent;
  let fixture: ComponentFixture<RepoSyncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepoSyncComponent ]
    })
    .compileComponents();
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
