import { Component } from '@angular/core';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AbstractControl, FormControl, FormGroup, NonNullableFormBuilder, ValidatorFn, Validators} from '@angular/forms';


@Component({
  selector: 'app-info-project-director',
  templateUrl: './info-project-director.component.html',
  styleUrl: './info-project-director.component.css'
})
export class InfoProjectDirectorComponent {
  project = {
    nameProject: '',
  }
  validateForm: FormGroup<{
    email: FormControl<string>;
    password: FormControl<string>;
    checkPassword: FormControl<string>;
    nickname: FormControl<string>;
    phoneNumberPrefix: FormControl<'+86' | '+87'>;
    phoneNumber: FormControl<string>;
    website: FormControl<string>;
    captcha: FormControl<string>;
    agree: FormControl<boolean>;
  }>;
  captchaTooltipIcon: NzFormTooltipIcon = {
    type: 'info-circle',
    theme: 'twotone'
  };

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator: ValidatorFn = (control: AbstractControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };

  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }

  constructor(private fb: NonNullableFormBuilder) {
    this.validateForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
      nickname: ['', [Validators.required]],
      phoneNumberPrefix: '+86' as '+86' | '+87',
      phoneNumber: ['', [Validators.required]],
      website: ['', [Validators.required]],
      captcha: ['', [Validators.required]],
      agree: [false]
    });
  }

  // tabla

     /*Fecha*/
     date = new Date();
     fecha = this.date;
     /*Nombre del proyecto*/
 
   /*Funcion del boton cargar archivo*/
   fileList: NzUploadFile[] = []; 
 
  /*Ver comentario*/
   isVisible = false;
 

 
   showModal(): void {
     this.isVisible = true;
   }
 
   handleOk(): void {
     console.log('Button ok clicked!');
     this.isVisible = false;
   }

}
