import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UsersService } from 'src/app/services/users.service'; 

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})

export class CreateUserComponent implements OnInit {

  emailDomainValidator: ValidatorFn = (control: AbstractControl)=> {
    const email = control.value;
    const validDomains = ['gmail.com', 'hotmail.com', 'outlook.com', 'mail.udes.edu.co'];
    if (email && !validDomains.some(domain => email.endsWith(domain))) {
      return { domain: true }; // Invalid domain
    }
    return null;
  };

  confirmValidator: ValidatorFn = (control: AbstractControl) => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
  
  validateForm: FormGroup<{
    userName: FormControl<string>;
    codigo: FormControl<number>;
    telefono: FormControl<string>;
    email: FormControl<string>;
    password: FormControl<string>;
    confirm: FormControl<string>;
    opcionSeleccionado: FormControl<string>;
    
  }> = this.fb.group({
      userName: ['', [Validators.required]],
      codigo: [ 0, [Validators.required]],
      telefono: ['', [Validators.required, Validators.pattern('^3[0-9]{9}$'), Validators.maxLength(10)]],
      email: ['', [Validators.email, Validators.required, this.emailDomainValidator]],
      password: ['', [Validators.required]],
      confirm: ['', [Validators.required, this.confirmValidator]],
      opcionSeleccionado: ['', [Validators.required]],
  });

  isConfirmPasswordVisible: boolean = false;
  isNewPasswordVisible: boolean = false;
  isVisible = false;
  isOkLoading = false;
  listaRoles: any[]= [];
  verSeleccion:String = '';


  constructor(
    public userService: UsersService,
    private  modal:NzModalService, 
    private fb: NonNullableFormBuilder) {}

  ngOnInit(): void {
    this.userService.getDatosRoles().subscribe(data => {
      this.listaRoles =data;      
    });
  }
  
  selectedValue = null;
//Crear usuario
 crearUsuario(){
  const user ={
    nombre: this.validateForm.value.userName,
    codigo: this.validateForm.value.codigo,
    correo: this.validateForm.value.email,
    celular: this.validateForm.value.telefono,
    pass: this.validateForm.value.password,
    confirmar: this.validateForm.value.confirm, 
    rol :this.validateForm.value. opcionSeleccionado
  };
  const idRol = this.validateForm.value.opcionSeleccionado;
  this.userService.CrearUser(user).subscribe(data => {
    if(data.success){       
      const dataUser = data.data;
      this.userService.setIdUserCreado(dataUser._id);
          this.modal.success({
            nzTitle: '¡Registro con exito!',
            nzContent: 'El usuario se ha creado con exito'
          });         
        }else{
          this.modal.error({
            nzTitle: '¡Datos invalidos!',
            nzContent: 'El usuario no se ha podido crear'
          });  
    }
  })
 }

 enforceMaxLength(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.value.length > 10) {
    input.value = input.value.slice(0, 10);
  }
}
 validateConfirmPassword(): void {
  setTimeout(() => this.validateForm.controls.confirm.updateValueAndValidity());
}

 toggleConfirmPasswordVisibility(): void {
  this.isConfirmPasswordVisible = !this.isConfirmPasswordVisible;
}

toggleNewPasswordVisibility(): void {
  this.isNewPasswordVisible = !this.isNewPasswordVisible;
}



 //---------------------------------------------
  submitForm(): void {
   this.crearUsuario();
   this.validateForm.reset();
  }
  //Metodo de cancelar y limbiar los campos del registro
  resetForm(e: MouseEvent): void {
    e.preventDefault();
    this.validateForm.reset();
  }
}

