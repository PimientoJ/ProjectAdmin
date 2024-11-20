import { Component, OnInit } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar.service';
import { ProcesoService } from 'src/app/services/proceso.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  FormControl,
  FormGroup,
  FormArray,
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
  // isVisibleAgregarPeriodo = false;
  // isVisibleAgregarYear = false;
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

  //Formulario para crear calendario
validateFormCalendario: FormGroup<{
  anio: FormControl<string>;
  semestre: FormControl<string>;
}> = this.fb.group({
  anio: ['', [Validators.required]],
  semestre: ['', [Validators.required]]
});

 // Formulario principal
 validateFormProcesosCalendario: FormGroup;

 // Lista de procesos
 listaProcesos: Array<{ id: number; controlInstance: string }> = [];


   // Método para agregar un nuevo campo dinámico
   addField(e?: MouseEvent): void {
    e?.preventDefault();

    const id = this.listaProcesos.length > 0 ? this.listaProcesos[this.listaProcesos.length - 1].id + 1 : 0;

    // Agregar un nuevo proceso a la lista
    const control = {
      id,
      controlInstance: `process${id}`
    };
    this.listaProcesos.push(control);

    // Crear un nuevo grupo de controles para el proceso
    (this.validateFormProcesosCalendario.get('procesos') as FormArray).push(
      this.fb.group({
        procesoId: ['', Validators.required], // Campo para seleccionar un proceso
        fechaEntrega: ['', Validators.required], // Fecha de entrega
        fechaSesionComite: ['', Validators.required], // Fecha de sesión de comité
        fechaEntregaResultados: ['', Validators.required] // Fecha de entrega de resultados
      })
    );
  }

  // Método para eliminar un campo de proceso
  removeField(index: number): void {
    (this.validateFormProcesosCalendario.get('procesos') as FormArray).removeAt(index);
    this.listaProcesos.splice(index, 1); // Eliminar también de la lista de procesos
  }

  // Método para obtener los controles del FormArray
  get procesosControls() {
    return (this.validateFormProcesosCalendario.get('procesos') as FormArray).controls;
  }

  // Método de submit para el formulario
  submitForm(): void {
    if (this.validateFormProcesosCalendario.valid) {
      console.log('Formulario válido:', this.validateFormProcesosCalendario.value);
      this.guardarNuevoCalendario();
    } else {
      console.log('Formulario inválido');
      // Marcar todos los controles como tocados
      this.validateFormProcesosCalendario.markAllAsTouched();
    }
  }


  async guardarNuevoCalendario() {
    const periodo = this.validateFormProcesosCalendario.value.semestre;
    const añoSeleccionado = this.validateFormProcesosCalendario.value.año;
    const año = añoSeleccionado ? añoSeleccionado.getFullYear() : null;
    const procesos = await this.transformarProcesos();

    const data = {
      periodo: periodo,
      año: año,
      proceso: procesos
    };

    this.calendarService.crearCalendario(data).subscribe({
      next: (response) => {
        // Si la respuesta es exitosa, muestra el mensaje de éxito
        if (response.success) {
          this.modal.success({
            nzContent: '¡Datos registrados con éxito!'
          });
          this.validateFormProcesosCalendario.reset();
          this.obtenerProcesos();
        } else {
          // Si no hay éxito, muestra un mensaje informativo
          this.modal.info({
            nzContent: response.msj || 'Hubo un problema al registrar los datos.'
          });
          this.validateFormProcesosCalendario.reset();
        }
      },
      error: (err) => {
        // Si hay un error en la solicitud HTTP (por ejemplo, error 500)
        console.error('Error al crear calendario:', err); // Imprime el error en la consola para debug
        this.modal.error({
          nzTitle: 'Error',
          nzContent: err.error?.msj || 'Hubo un error al intentar registrar los datos. Intenta nuevamente más tarde.'
        });
      }
    });
    
    console.log(año); // Esto imprimirá solo el año (por ejemplo, 2026)

  }

  async transformarProcesos() {
    const proceso = this.validateFormProcesosCalendario.value.procesos;
  
    // Creamos un array de promesas para obtener los datos de los procesos
    const procesosTransformados = await Promise.all(proceso.map(async (item: any) => {
      try {
        // Usamos firstValueFrom en lugar de toPromise
        const procesoInfo = await firstValueFrom(this.procesoService.getProceso(item.procesoId));
  
        // Transformamos la información obtenida
        return {
          nombre: procesoInfo.nombre,
          fechaEntrega: item.fechaEntrega,
          fechaSesioncomite: item.fechaSesionComite,
          fechaResultado: item.fechaEntregaResultados
        };
      } catch (error) {
        console.error('Error al obtener el proceso:', error);
        return null; // Si hay error, retornamos null o puedes manejar el error de otra manera
      }
    }));
  
    // Filtramos los procesos nulos (en caso de error en alguna petición)
    const procesosValidados = procesosTransformados.filter(proceso => proceso !== null);
  
    console.log(procesosValidados);
    return procesosValidados;  // Aquí retornamos el array con los procesos transformados
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

    this.validateFormProcesosCalendario = this.fb.group({
      semestre: ['', Validators.required],
      año: ['', Validators.required],
      procesos: this.fb.array([]) // Aquí usas FormArray para los campos dinámicos
    });
    }

  //Metodos
  ngOnInit(): void {
    this.ObtenerDatosCalendario();
    this.mostrarDatosUsuario(); 
    this.addField();
    this.calendarioActivo();
     
   }

  //  onFechaEntregaChange(date: Date): void {
  //   if (date) {
  //     // Add 1 day to the selected fechaEntrega to set fechaComite
  //     const fechaComite = new Date(date);
  //     fechaComite.setDate(fechaComite.getDate() + 1);
  
  //     // Update the form control for fechaComite
  //     this.validateFormCalendario.controls['fechaComite'].setValue(fechaComite);
  //   }
  // }

     // Función para deshabilitar fechas anteriores a hoy
  // disabledDate1 = (current: Date): boolean => {
  //   // No se pueden seleccionar fechas anteriores al día actual
  //   return current < new Date();
  // };

  disabledDate2 = (current: Date, selectedDate?: Date): boolean => {
    if (!selectedDate) return false; // If no date is selected, don't disable any dates.
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1); // Set to the day after the selected "Fecha de Entrega"
    return current < nextDay;
  };

  disabledDate1 = (current: Date): boolean => {
    // No se pueden seleccionar fechas anteriores al día actual
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 0); // Establece el día de mañana
    return current < tomorrow;
  };

  disabledDate = (current: Date): boolean => {
    // No se pueden seleccionar fechas anteriores al día actual
       return current && current.getFullYear() < new Date().getFullYear();
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
    window.location.reload();
    this.visibleAgg = false;
  }
  closeHistorial(): void {
    this.visibleHistorial = false;
  }

// Metodo de agregar un nuevo proceso
  // agregarProcesoNuevo():void{
  //   if(this.validateFormNuevoProceso.value.newProceso == ''){
  //     this.modal.error({
  //       nzContent: '¡Dato no validado!'
  //     });}else{
  //     const nombreProcesoNuevo = {
  //       nombre: this.validateFormNuevoProceso.value.newProceso
  //     };
  //     this.procesoService.postProcesos(nombreProcesoNuevo).subscribe(data => {
  //       if(data.success){
  //         this.modal.success({
  //           nzContent: '¡Dato registrados con exito!'
  //           });
  //           this.validateFormNuevoProceso.reset();
  //           this.obtenerProcesos();
  //       }else{
  //         this.modal.info({
  //           nzContent: "El proceso ha sido añadido con éxito"
  //         });
  //         this.validateFormNuevoProceso.reset();
  //       }
          
  //     });}
  // }

//Crear calendario
crearcalendario(){
  
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


/*proceso*/
openModalAgregarProceso(): void{
  this.isVisibleAgregarProceos =true;
}

updateModalAgregarProceso(): void {
  // Limpiar el formulario
  this.validateFormNuevoProceso.reset();
  
  // Obtener datos actualizados, si es necesario
  this.obtenerProcesos();

  // Abrir el modal
  this.isVisibleAgregarProceos = true;
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
          nzContent:  "El proceso ha sido añadido con éxito"
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
          this.updateModalAgregarProceso();
          // this.obtenerProcesos();
      });
}

confirmCancel(): void {
  this.modal.confirm({
    nzTitle: '¿Estás seguro de que deseas cancelar el proceso?',
    // nzContent: 'Si cancelas, no se guardaran los cambios.',
    nzOkText: 'Sí',
    nzCancelText: 'No',
    nzOnOk: () => this.closeagg(), // Llama a la función de cierre si elige "Sí"
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

