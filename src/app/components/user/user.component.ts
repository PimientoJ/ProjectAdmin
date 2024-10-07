import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UsersService } from 'src/app/services/users.service';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit{

  EditarForm:FormGroup<{
    nombre: FormControl<string>;
    codigo: FormControl<string>;
    rol: FormControl<string>;
    correo: FormControl<string>;
    telefono: FormControl<string>;
  }> = this.fb.group({
    nombre: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    rol: ['', [Validators.required]],
    correo: ['', [Validators.required]],
    telefono: ['', [Validators.required]]
  });

  data: any[] = [];
  user: any = {};
  listaRol:any = {};
  i: number = 0;
  listaRoles: any[]= [];
  idUserPut:string = '';
  nombreUser:string ='';
  codigoUser:string ='';
  rolsUser:string ='';
  correoUser:string ='';
  telefonoUser:string ='';
  selectedValue:any = '';
  visible = false;

  constructor(
    public userService: UsersService, 
    private fb: NonNullableFormBuilder,
    private modal: NzModalService) {}

 
 
  ngOnInit(): void {
    this.llenarDataTabla();
  }

  llenarDataTabla(){
    this.userService.getUsers().subscribe(data => {
      this.data = data;         
    });
 } 
     //Acciones de los botones del editar usuario
   editarDatosUsuario(id: string){ 
    this.idUserPut = id;
    this.visible = true;
   this.userService.getUserLogged(id).subscribe(datos=> {
       this.nombreUser = datos.nombre;
       this.codigoUser = datos.codigo;
       this.correoUser = datos.correo;
       this.telefonoUser = datos.celular;
       this.userService.getNombreRolUsuario(datos.rol).subscribe((dataRol) => {this.rolsUser=dataRol});
       this.userService.getDatosRoles().subscribe(data => {
        this.listaRoles = data;      
      });
   });
  }   
  actualizarDatos(){
    const datosActualizar ={
      nombre: this.nombreUser,
      codigo: this.codigoUser,
      correo: this.correoUser,
      celular: this.telefonoUser,
      rol: this.selectedValue,
    };
    this.userService.putUser(this.idUserPut, datosActualizar).subscribe((data)=>{
      if(data.success){        
          this.modal.success({
            nzTitle: '¡Registro con exito!',
            nzContent: 'El usuaio se ha actualizado datos del usuario con exito'
          });  
      }
      this.llenarDataTabla();
    })
    this.visible = false;
  }
  close(): void {
    this.visible = false;
  }
  //Acciones de los botones del eliminar usuario
    eliminarDatosUsuario(id: string): void {  
      this.userService.deleteUser(id).subscribe(data =>{
         this.modal.success({
          nzContent: '¡Los datos se han eliminado con exito!'
          }); 
          this.llenarDataTabla();
      });
    }

}
