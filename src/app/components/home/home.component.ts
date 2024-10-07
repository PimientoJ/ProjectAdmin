import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar.service';
import { ProcesoService } from 'src/app/services/proceso.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  FormControl,
  FormGroup,
  FormRecord,
  NonNullableFormBuilder,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //Variables para habilitar botones
  verBotonActualizar:boolean= false;
  verBotonAgg:boolean= false;
  verBotonHistorial:boolean = false;
  visibleActualizar = false;
  visibleAgg = false;
  visibleHistorial = false;
  datosCalendario:any[] = [];
  calendarioAct:any[] = [];
  datosProcesos:any[] = [];
  years: any[]= [];
  periodo= ['A', 'B'];
  procesos: any[]=[];
  isVisibleAgregarProceos = false;
  //------//
  searchValue = '';
  visible = false;

  //formulario para agregar un nuevo proceso
  validateFormNuevoProceso:FormGroup<{
    newProceso:FormControl<string>;
  }>;
  //Editar proceso
  editCache: { [key: string]:any} = {};
  listOfData = this.procesos;

  // agregar procesos al calendario
  validateFormProcesosCalendario: FormRecord<
  FormControl<string>> = this.fb.record({});
  listaProcesos: Array<{ id: number; controlInstance: string }> = [];

  addField(e?: MouseEvent): void {
    e?.preventDefault();

    const id = this.listaProcesos.length > 0 ? this.listaProcesos[this.listaProcesos.length - 1].id + 1 : 0;

    const control = {
      id,
      controlInstance: `passenger${id}`
    };
    const index = this.listaProcesos.push(control);
    console.log(this.listaProcesos[this.listaProcesos.length - 1]);
    this.validateFormProcesosCalendario.addControl(
      this.listaProcesos[index - 1].controlInstance,
      this.fb.control('', Validators.required)
    );
  }

  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listaProcesos.length > 1) {
      const index = this.listaProcesos.indexOf(i);
      this.listaProcesos.splice(index, 1);
      console.log(this.listaProcesos);
      this.validateFormProcesosCalendario.removeControl(i.controlInstance);
    }
  }

  submitForm(): void {
    if (this.validateFormProcesosCalendario.valid) {
      console.log('submit', this.validateFormProcesosCalendario.value);
    } else {
      Object.values(this.validateFormProcesosCalendario.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  //fin de agregar procesos al calendario

  //constructor
  constructor( 
    public calendarService: CalendarService,
    public procesoService: ProcesoService,
    public userService: UsersService,
    private fb: NonNullableFormBuilder,
    private router: Router,
    private msg: NzMessageService,
    private modal: NzModalService){
    //El año del calendario agendar 
      const year = new Date().getFullYear();
      const años: any=[];     
      for (let index = 2022; index <= year+1; index++) {
        años.push(index);  
        this.years = años     
      } 
    this.validateFormNuevoProceso=this.fb.group({
        newProceso: ['', [Validators.required]]
    });
    }

  //Metodos
  ngOnInit(): void {
    this.ObtenerDatosCalendario();
    this.mostrarDatosUsuario(); 
    this.addField();
    this.calendarioActivo();
     
   }

     // Función para deshabilitar fechas anteriores a hoy
  disabledDate = (current: Date): boolean => {
    // No se pueden seleccionar fechas anteriores al día actual
    return current < new Date();
  };

  calendarioActivo(){

    this.calendarService.getCalendarActivo().subscribe((data) => {
      console.log("Se encontró el calendario activo...",data[0].proceso)
      this.calendarioAct = data[0].proceso;
    });
  }
  
   //Se extrae los datos del usuario para obtener el rol y poder validar el crud del calendario
   mostrarDatosUsuario(){
    const id = this.userService.getUserLogueId(); 
    this.userService.getUserLogged(id).subscribe((data) => {  
    this.userService.getNombreRolUsuario(data.rol).subscribe((dataRol) => { 
      if(dataRol == 'Administrador'){
        this.verBotonActualizar= true;
        this.verBotonAgg= true;
        this.verBotonHistorial = true;
       /* for (let index = 0; index < this.datosProcesos.length; index++) {
          if(index < 3){
            this.verBotonesAgg=true;
          }else{
            this.verBotonesAgg=false;
          }
        }*/
      }
    });
  });
}    
  openActualizar(): void {
   this.visibleActualizar = true;
   this.calendarioActivo();
  }
  openAgg(): void {
   this.visibleAgg = true;
   this.obtenerProcesos();

  }
  obtenerProcesos(): void{
    this.procesoService.getProcesos().subscribe(data => {
      this.procesos= data;
     });
  }

  activarCalendario(id: string) : void {

    console.log("Activar calendario: ",this.datosCalendario)
      this.datosCalendario.forEach((element: any) => {
        let data;
        if(element._id === id){
          data={
            estado: true
          }
        }else{
          data={
            estado: false
          }
        }
        console.log("se envia...",element._id, ":", data)
        this.calendarService.putCalendario(element._id , data).subscribe();
      });
      this.msg.success('Calendario actualizado con éxito');

  }
  openHistorial(): void {
   this.visibleHistorial = true;
  }
  closeactualizar(): void {
    this.visibleActualizar = false;
  }
  closeagg(): void {
    this.visibleAgg = false;
  }
  closeHistorial(): void {
    this.visibleHistorial = false;
  }
 //Mostrar los datos del calendario registrados
 ObtenerDatosCalendario(){
  this.calendarService.getCalendar().subscribe(data => {
   this.datosCalendario = data;
   console.log("datos:", this.datosCalendario)
  /* for (let index = 0; index < data.length; index++) {
    const element = data[index]._id;
    this.obtenerDatosDeProcesosCalendario(element);
   }*/
   
   /*this.calendarService.setCalendarioId(data[0]._id);
   const id = this.calendarService.getCalendarioId();
    this.calendarService.getProcesos(id).subscribe(data => {
      this.datosProcesos = data;
      console.log(this.datosProcesos);
      }); */
  }); 
}
obtenerDatosDeProcesosCalendario(idCalendario:String){
console.log(idCalendario);
    this.calendarService.getProcesos(idCalendario).subscribe(data => {
      this.datosProcesos = data;      
      });
}
openModalAgregarProceso(): void{
  this.isVisibleAgregarProceos =true;
}
aceptarAgregarProceso():void{
this.isVisibleAgregarProceos=false;
}
cancelarAgregarProceso():void{
  this.isVisibleAgregarProceos=false;
  }
AgregarProcesoNuevo():void{
  if(this.validateFormNuevoProceso.value.newProceso == ''){
    this.modal.error({
      nzContent: '¡Dato no validado!'
    });}else{
    const nombreProcesoNuevo = {
      nombre: this.validateFormNuevoProceso.value.newProceso
    };
    this.procesoService.postProcesos(nombreProcesoNuevo).subscribe(data => { 
      if(data.success){
        this.modal.success({
          nzContent: '¡Dato registrados con exito!'
          });
          this.validateFormNuevoProceso.reset();
          this.obtenerProcesos();
      }else{
        this.modal.info({
          nzContent: data.msj
        });
        this.validateFormNuevoProceso.reset();
      }
        
    });}
}
editarProceso(id: string):void{
  this.editCache[id].edit = true;
}
cancelEdit(id: string): void {
  const index = this.listOfData.findIndex(item => item.id === id);
  this.editCache[id] = {
    data: { ...this.listOfData[index] },
    edit: false
  };
}

saveEdit(id: string): void {
  const index = this.listOfData.findIndex(item => item.id === id);
 // Object.assign(this.listOfData[index], this.editCache[id].data);
  this.editCache[id].edit = false;
}
updateEditCache(): void {
  this.listOfData.forEach(item => {
    this.editCache[item.id] = {
      edit: false,
      data: { ...item }
    };
  });
}
eliminarProceso(id: string):void{
      this.procesoService.deleteProceso(id).subscribe(data =>{
          this.modal.success({
          nzContent: '¡Los datos se han eliminado con exito!'
          }); 
          this.obtenerProcesos();
      });
}
/*-------------*/
reset(): void {
  this.searchValue = '';
  this.search();
}

search(): void {
  this.visible = false;
  //this.listOfDisplayData = this.listOfData.filter((item: DataItem) => item.name.indexOf(this.searchValue) !== -1);
}
  //Datos para agg un nuevo dato del calendario
 /* validateForm: FormGroup<{
    year: FormControl<string>;
    periodo: FormControl<string>;
    proceso: FormControl<string>;
    fechaEntrega: FormControl<Date>;
    fechaSesioncomite: FormControl<Date>;
    fechaResultado: FormControl<Date>;
  }> = this.fb.group({
    year: ['', [Validators.required]],
    periodo: ['', [Validators.required]],
    proceso: ['', [Validators.required]],
    fechaEntrega: [new Date, [Validators.required]],
    fechaSesioncomite: [new Date, [Validators.required]],
    fechaResultado: [new Date, [Validators.required]]
  }); 

  EditarForm:FormGroup<{
    fechaEntrega1: FormControl<Date>;
    fechaSesioncomite1: FormControl<Date>;
    fechaResultado1: FormControl<Date>;
  }> = this.fb.group({
    fechaEntrega1: [new Date, [Validators.required]],
    fechaSesioncomite1: [new Date, [Validators.required]],
    fechaResultado1: [new Date, [Validators.required]]
  }); 

  //Variables        
    usersRol: any = {};
    
    
    datoEditarProceso: any[]=[];
    years: any[]= [];
    periodo= ['A', 'B'];
    proceso=['Propuesta de trabajo grado', 'Anteproyecto', 'Proyecto Final', 'Sustentación'];
    
    visibleEditarProceso = false;
    EditarProceso: Boolean = false;
    nombreProceso: string = '';
  
  
  //Acciones de los botones del agregar en el calendario si es administrador
    ActualizarDatosCalendarioPeriodoYear(){
      if(this.validateForm.value.periodo == ''){
        this.modal.error({
          nzContent: '¡Datos del periodo no validados!'
        });
      }else if (this.validateForm.value.year == ''){
        this.modal.error({
          nzContent: '¡Datos del año no validados!'
        });        
      }else{
        const dataCalendario = {
          periodo: this.validateForm.value.periodo, 
          year: this.validateForm.value.year};

          this.calendarService.putCalendarioPeriodoYear(dataCalendario).subscribe(data => { 
            this.modal.success({
                nzContent: '¡Datos registrados con exito!'
                });
                this.ObtenerDatosCalendario();
                this.validateForm.reset(); 
            });
      }       
       this.visibleActualizar = false;
    }

    //Acciones de los botones del ditar en el calendario si es administrador
    aggDatosCalendarioProcesos(){
      const dataCalendarioProceso = {
        nombre: this.validateForm.value.proceso, 
        fechaEntrega: this.validateForm.value.fechaEntrega,
        fechaSesioncomite: this.validateForm.value.fechaSesioncomite,
        fechaResultado: this.validateForm.value.fechaResultado
      };
      const id = this.calendarService.getCalendarioId(); 
      console.log("Datos que envia: ", dataCalendarioProceso);
      this.calendarService.postDatosProcesos(id, dataCalendarioProceso).subscribe(data => { 
        console.log("Msj:", data);
          this.modal.success({
              nzContent: '¡Datos registrados con exito!'
              });
              this.visibleAgg = false;
              this.ObtenerDatosCalendario();
              this.validateForm.reset();
      });
    }
    //Acciones de los botones del ditar en el calendario si es administrador
    editarDatosCalendario(id: string){ 
      this.visibleEditarProceso=true;      
      const idCal = this.calendarService.getCalendarioId();
      this.calendarService.getDatoDelProceso(idCal, id).subscribe(data =>{
        this.nombreProceso = data.nombre;
      });
      const dataProceso = {
          fechaEntrega: this.EditarForm.value.fechaEntrega1,
          fechaSesioncomite: this.EditarForm.value.fechaSesioncomite1,
          fechaResultado: this.EditarForm.value.fechaResultado1
      };
      console.log("Datos editados:", this.EditarForm.value.fechaEntrega1)
      this.calendarService.putDatoProceso( idCal, id, dataProceso).subscribe(data => { 
        this.EditarProceso = data.isOk;
        console.log("editar proceso", this.EditarProceso);
      });
    }
  
  
  //Acciones de los botones del eliminar en el calendario si es administrador
    eliminarDatosCalendario(id: string): void { 
      const idCal = this.calendarService.getCalendarioId(); 
      this.calendarService.deleteDatoProceso(idCal, id).subscribe(data =>{
         this.modal.success({
          nzContent: '¡Los datos se han eliminado con exito!'
          }); 
          this.ObtenerDatosCalendario();
      });
    }


  //Mostrar los datos del calendario en la tabla
   ObtenerDatosCalendario(){
      this.calendarService.getCalendar().subscribe(data => {
      console.log(data)
       this.datosCalendario = data;
       this.calendarService.setCalendarioId(data[0]._id);
       const id = this.calendarService.getCalendarioId();
        this.calendarService.getProcesos(id).subscribe(data => {
          this.datosProcesos = data;
          console.log(this.datosProcesos);
          }); 
      }); 
    }

  //Metodos del modal
  cancelar(){  
    this.visibleEditarProceso=false;
  }
  aceptar(){
    if (this.EditarProceso){
      this.modal.success({
        nzContent: '¡Se ha actualizado de forma exitosa!'
        });            
        this.visibleEditarProceso=false;
        this.ObtenerDatosCalendario();
        this.EditarForm.reset();
    }
  }*/

 
 //---------------------Historial del calendario---------------
 /* openHistorial(){
    this.visibleHistorial = true;

  }*/
}

