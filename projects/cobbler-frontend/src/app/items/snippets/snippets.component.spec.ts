import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {RouterTestingModule} from '@angular/router/testing';

import {SnippetsComponent} from './snippets.component';

// eslint-disable-next-line @angular-eslint/component-selector
@Component({selector: 'router-outlet', template: ''})
class RouterOutletStubComponent {
}

describe('SnippetsComponent', () => {
  let component: SnippetsComponent;
  let fixture: ComponentFixture<SnippetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SnippetsComponent,
        RouterOutletStubComponent
      ],
      imports: [
        RouterTestingModule,
        MatListModule
      ]
    })
      .compileComponents();
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
