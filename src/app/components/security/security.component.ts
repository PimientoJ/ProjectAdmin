import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent {
  validateForm: FormGroup<{
    password: FormControl<string>;
    pass: FormControl<string>;
    confirm: FormControl<string>;
  }>;

  idUser: String = '';

  constructor(private fb: NonNullableFormBuilder, public userService: UsersService, private modal: NzModalService,) {
    this.validateForm = this.fb.group({
      password: ['', [Validators.required]],      
      pass: ['', [Validators.required]],
      confirm: ['', [this.confirmValidator]]
    });
  }
  submitForm(): void {
    console.log('submit', this.validateForm.value);
    const dataPass = { 
      pass: this.validateForm.value.pass
    };
     this.idUser = this.userService.getUserLogueId(); 
    this.userService.putPassword(this.idUser, dataPass).subscribe(data => {        
       if(data.isOk){          
        this.modal.success({
          nzContent: '¡La contraseña se a modificada exitosamente!'
          }); 
          this.validateForm.reset();        
      }
      });
  }

  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }

  validateConfirmPassword(): void {
    setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
  }

  /*userNameAsyncValidator: AsyncValidatorFn = (control: AbstractControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          // you have to return `{error: true}` to mark it as an error event
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });*/

  confirmValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.pass.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

 
}
