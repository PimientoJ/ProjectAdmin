import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UsersService } from 'src/app/services/users.service'; 

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  
  validateForm: FormGroup<{
    userName: FormControl<string>;
    codigo: FormControl<number>;
    telefono: FormControl<number>;
    email: FormControl<string>;
    password: FormControl<string>;
    opcionSeleccionado: FormControl<string>;
  }> = this.fb.group({
      userName: ['', [Validators.required]],
      codigo: [ 0, [Validators.required]],
      telefono: [0, [Validators.required]],
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]],
      opcionSeleccionado: ['', [Validators.required]],
  });

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
