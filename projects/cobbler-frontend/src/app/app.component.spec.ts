import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {provideRouter} from "@angular/router";

@Component({selector: 'cobbler-manage-menu', template: '', standalone: true})
class AppManageMenuStubComponent {
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AppComponent,
        AppManageMenuStubComponent,
        NoopAnimationsModule
      ],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
