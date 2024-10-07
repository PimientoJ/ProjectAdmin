import { Component, OnInit } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UsersService } from 'src/app/services/users.service';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { EstudianteService } from 'src/app/services/estudiante.service';
import { BehaviorSubject, Observable, debounceTime, of, switchMap } from 'rxjs';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormRecord,
  NonNullableFormBuilder,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit  {

  validateForm: FormGroup = this.fb.group({});
  estudiantes: any[] = []; // Variable para almacenar los estudiantes

//Variables de jurado
  validateFormJurado: FormGroup<{
    jurado1: FormControl<string>;
    jurado2: FormControl<string>;
    jurado3: FormControl<string>;
  }> = this.fb.group({
    jurado1: ['', [Validators.required]],
    jurado2: ['',  [Validators.required]],
    jurado3: ['', [Validators.required]]
  });

  valuejurado1:string ='';
  valuejurado2:string ='';
  valuejurado3:string ='';
  jurado1:boolean = false;
  jurado2:boolean = false;
  jurado3:boolean= false;
  botonIngresarjurado:boolean = true;
  listadeJurados:any={};

  data: any[] = [];
  usersEstudiante: any[] = [];
  estudiante:  any[] = [];
  isVisible = false;
  idProjectPut:string = '';
  titulo:string ='';
  director:string ='';
  codirector:string ='';
  visibleModalStuden = false;
  visibleModalJurado = false;
  selectedValue:any = '';
  visible = false;
  //Modal studiante
  control:any={};
  jueces:any={};
  // validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  listOfControl: Array<{ id: any; nombre: string;}> = [];
  listaJuez: Array<{ id: any; nombre: string;}> = [];
  //Agg estudainte
  searchChange$ = new BehaviorSubject('');
  optionList: string[] = [];
  selectedUser?: string;
  isLoading = false;
  

  constructor(
    public userService: UsersService, 
    public projectService: ProyectoService,
    private modal: NzModalService,
    private fb: NonNullableFormBuilder,
    public studenService: EstudianteService) {
    }

  ngOnInit(): void {    
    this.llenarDatoProyecto();
    this.agregarCampoEstudiante();
    this.userService.getRolJurado().subscribe(data=>{
      this.listadeJurados = data;
      this.isLoading = false;
    });
  }
   

//llenar la tabla con los datos proyecto
  llenarDatoProyecto(){
    this.projectService.proyectos().subscribe(data => {
      this.data = data;     
    });
  }
//Acciones de los botones del editar usuario
  editarDatosProyecto(id:string){
    this.idProjectPut = id;
    this.visible = true;
   this.projectService.datoProyecto(id).subscribe(datos=> {
       this.titulo = datos.titulo;
       this.director = datos.director;
       this.codirector = datos.codirector;
   });
  }
  actualizarDatos(){
    const datosActualizar ={
      titulo: this.titulo,
      director: this.director,
      codirector: this.codirector
    };
    this.projectService.actualizarProyecto(this.idProjectPut, datosActualizar).subscribe((data)=>{
      console.log("datos succes", data.success);
     if(data.success){        
          this.modal.success({
            nzTitle: '¡Registro con exito!',
            nzContent: 'Información actualizada correctamente'
          });  
      }
      this.llenarDatoProyecto();
    })
    this.visible = false;
  }
  close(): void {
    this.visible = false;
  }
  //Acciones de los botones del eliminar usuario
  eliminarDatosProyecto(id: string): void { 
    console.log("id eliminar", id) 
    this.projectService.eliminarProyecto(id).subscribe(data =>{
        this.modal.success({
        nzContent: '¡El proyecto se ha eliminado con exito!'
        }); 
        this.llenarDatoProyecto();
    });
  }
  //Datos de estudiante del proyecto
  datosStuden(id:any){
    this.visibleModalStuden=true;
    this.projectService.datoEstudianteProyecto(id).subscribe(estudiantes=>{
      for (let index = 0; index < estudiantes.length; index++) {
        const element = estudiantes[index];        
        this.control = {
          id,
          nombre:`${element.nombre}`
         };
         this.listOfControl.push(this.control);
      }
    });
  }
  //Modal studiante
  agregarCampoEstudiante(e?: MouseEvent): void {
    this.listOfControl.length >= 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;
    const index = this.listOfControl.push(this.control);
    console.log("index", index);
    this.validateForm.addControl(
      this.listOfControl[index - 1].nombre,
      this.fb.control('', Validators.required)
    );
  }

  removeField(i: { id: number; nombre: string;}, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      this.modal.success({
        nzContent: '¡Se ha eliminado exitosamente!'
        });
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      console.log(this.listOfControl);
      this.validateForm.removeControl(i.nombre);
    }
  }
   cancelar(){  
    this.visibleModalStuden=false;
  }
  aceptar(){
    if (this.validateForm.valid) {
      this.visibleModalStuden=false;
      this.llenarDatoProyecto();
      this.modal.success({
         nzContent: '¡Se ha actualizado de forma exitosa!'
      });
      console.log('submit', this.validateForm.value);
      this.validateForm.reset();
      this.listOfControl.pop();
    } else {
      console.log('2');
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }    
  }
  //Buscar estudiante
  onSearch(value: string): void {
    this.isLoading = true;
    this.searchChange$.next(value);
  }

//Modal de jurado
  datosJurado(id: string){
    console.log("id del proyecto", id)
    this.visibleModalJurado = true;
    this.projectService.datoJuezProyecto(id).subscribe(data=>{
      const numJurado = data.length;
      if(numJurado == "1"){
        this.jurado1=true;
      }else if(numJurado == "2"){
        this.jurado1=true;
        this.jurado2=true;
      }else if(numJurado == "3"){
        this.jurado1=true;
        this.jurado2=true;
        this.jurado3 = true;
        this.botonIngresarjurado = false;
      }
      for (let index = 0; index < data.length; index++) {
        const element = data[index];  
        this.valuejurado1 = data[0].nombre;
        this.valuejurado2 = data[1].nombre;
        this.valuejurado3 = data[2].nombre;      
        
        this.jueces = {
          id:`${element._id}`,
          nombre:`${element.nombre}`
         };
         this.listaJuez.push(this.jueces);
      }
      this.editarJurado();
    });
  }
  Agregarjurado(e?: MouseEvent): void {
    if(!this.jurado1){
      this.jurado1 = true;
    }else if(!this.jurado2){
      this.jurado2 = true;
      e?.preventDefault();
    }else{
      this.jurado3 = true;
      this.botonIngresarjurado=false;
    }
 }
  cancelarModalJurado(){
    this.visibleModalJurado = false;
    this.valuejurado1 = '';
    this.valuejurado2 = '';
    this.valuejurado3 = '';
    this.jurado1=false;
        this.jurado2=false;
        this.jurado3 = false;
  } 
  
  aceptarModalJurado(){
    this.visibleModalJurado = false;
    this.valuejurado1 = '';
    this.valuejurado2 = '';
    this.valuejurado3 = '';
    this.jurado1=false;
    this.jurado2=false;
    this.jurado3 = false;
  } 
  eliminarJurado(){

  }
  editarJurado(){
    
    
  }
}
