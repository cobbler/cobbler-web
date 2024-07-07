import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { CobblerApiService } from 'cobbler-api';

@Component({
  selector: 'cobbler-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css'],
  standalone: true,
  imports: [
    RouterOutlet,
    MatFormFieldModule,
    MatLabel,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
})
export class FilesComponent implements OnDestroy {
  cobblerApiSvc = inject(CobblerApiService)
  data = [];

  subs = new Subscription();
  filesForm: FormGroup;

  errorMsg = signal({
    action: '',
    group: '',
    mode: '',
    path: '',
    comment: '',
    is_dir: '',
    name: '',
    owners: '',
    template: '',
  });

  constructor(service: FilesService, private fb: FormBuilder) {
    this.data = service.getAll();
    // this.subs.add(
    //   this.cobblerApiSvc.get_file('bert').subscribe(data=>{
    //     console.log('svc', data)
    //   })
    // )
    this.subs.add(
      this.filesForm.valueChanges.subscribe((form) => {
        this.updateErrMessage();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  setForm(idx: number) {
    this.filesForm = this.fb.group({
      action: new FormControl(this.data[idx].action),
      group: new FormControl(this.data[idx].group, [Validators.required]),
      mode: new FormControl(this.data[idx].mode, [Validators.required]),
      path: new FormControl(this.data[idx].path, [Validators.required]),
      comment: new FormControl(this.data[idx].comment),
      is_dir: new FormControl(this.data[idx].is_dir),
      name: new FormControl(this.data[idx].name, Validators.required),
      owners: new FormControl(this.data[idx].owners, [Validators.required]),
      template: new FormControl(
        this.data[idx].template,
        this.data[idx].is_dir ? [] : [Validators.required]
      ),
    });
  }

  updateErrMessage() {
    if (this.filesForm.controls['name'].hasError('required')) {
      this.errorMsg.update((err) => ({ ...err, name: 'Name is required' }));
    } else {
      this.errorMsg.update((err) => ({
        action: '',
        group: '',
        mode: '',
        path: '',
        comment: '',
        is_dir: '',
        name: '',
        owners: '',
        template: '',
      }));
    }
  }

  onSubmit() {}

  onCancle() {}
}
