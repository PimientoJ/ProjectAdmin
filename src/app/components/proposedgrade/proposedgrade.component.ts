import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { UsersService } from 'src/app/services/users.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { disableDebugTools } from '@angular/platform-browser';

@Component({
  selector: 'app-proposedgrade',
  templateUrl: './proposedgrade.component.html',
  styleUrls: ['./proposedgrade.component.css']
})
export class ProposedgradeComponent implements OnInit {

  //Variables del formulario
  validateForm: FormGroup<{
    titulo: FormControl<string>;
    fecha: FormControl<Date>;
    proceso: FormControl<string>;
    integrante1: FormControl<string>;
    integrante2: FormControl<string>;
    integrante3: FormControl<string>;
    lineaInvestigacion: FormControl<string>;
    semilleroInvestigacion: FormControl<string>;
    estadoProceso: FormControl<string>;
    radioValue: FormControl<string>;
  }> = this.fb.group({
    titulo: ['', [Validators.required]],
    fecha: [new Date(),  [Validators.required]],
    proceso: ['', [Validators.required]],
    integrante1: ['',  [Validators.required]],
    integrante2: ['',  [Validators.required]],
    integrante3: ['', [Validators.required]],
    lineaInvestigacion: ['', [Validators.required]],
    semilleroInvestigacion: ['', [Validators.required]],
    estadoProceso: ['', [Validators.required]],
    radioValue: ['', [Validators.required]]
  });
  Userintegrante1:string = '';
  idUserIntegrante1:string = '';
  datasemillero:boolean=false;
  SolicitudPropuesta:boolean =true;
  propuestaGrado:Boolean = true;
  infoPropuestaGrado:Boolean= false;
  TablaEstado:Boolean= false;
  integrante2:boolean = false;
  integrante3:boolean= false;
  botonIngresarIntegrante:boolean = true;
  dataprueba: any[] = [];
  dataUsers: any[] = [];
  datoProyecto: any = {};
  idproject:string='';
  estadoProyecto: string='';

  private fileTmp:any;
  private dataProject:any;

  proceso:string='';

    //Paneles
    panels1 = [
      {
        active: false,
        name: 'Solicitud Dirección y/o Codirección Propuestad de Grado',
      }
    ];
    panels2 = [
      {
        active: false,
        name: 'Presentación Propuesta Proyecto de Grado',
      }
    ];
  
    constructor(
      private http: HttpClient, 
      private msg: NzMessageService,
      private proyectoService: ProyectoService,
      private userServis: UsersService,
      private fb: NonNullableFormBuilder,) {}

  uploading = false;
  fileList: NzUploadFile[] = [];

  ngOnInit(): void {
   const usuario = this.userServis.getUserLogueId();
   this.userServis.getUserLogged(usuario).subscribe(data=> {    
    this.Userintegrante1 = data.nombre;
    this.idUserIntegrante1 = data._id;
   })
    const dato = this.proyectoService.procPropuestaGrado;
    console.log("dato", dato);
    if(dato){
      this.proceso = this.proyectoService.getProceso();
      this.idproject=this.proyectoService.getIdProyecto();
      this.estadoProyecto = this.proyectoService.getEstadoPropuesta();
    }
   
    console.log("idproject", this.idproject);
   if(this.proceso == 'Propuesta de grado' && (this.estadoProyecto == 'Pendiente' || this.estadoProyecto == 'Aprobado')){
    this.SolicitudPropuesta=false;
    this.TablaEstado = true;
    this.proyectoService.datoProyecto(this.idproject).subscribe(data=>{
      this.datoProyecto = data;
    }); 
   } 

   this.userServis.getUsers().subscribe(data =>{
      this.dataUsers = data;
  });
  }

    //------------------Cargar proyecto------------------------------
     //captcha Icono de información sobre herramientas( solo puede agg 3 integrantes)
     AgregarIntegrante(e?: MouseEvent): void {
        if(!this.integrante2){
          this.integrante2 = true;
          e?.preventDefault();
        }else{
          this.integrante3 = true;
          this.botonIngresarIntegrante=false;
        }
     } 
    //Semillero de investigacion
    semillero(){      
      if(this.validateForm.value.radioValue === 'A'){
        this.datasemillero=true;
      }else if(this.validateForm.value.radioValue === 'B'){
        this.datasemillero=false;
      }
    }
    //subir archivo del formulario del trabajo de grado
    getfile($event: any):void{
    const [ file ] = $event.target.files;
      this.fileTmp = {
        fileRaw:file
      }
    }
    //Guardar Datos del proyecto
    enviarDatosProyecto(){
     this.dataProject = {
        titulo: this.validateForm.value.titulo,
        fecha: this.validateForm.value.fecha,
        proceso: 'Propuesta de grado',
        lineaInvestigacion: this.validateForm.value.lineaInvestigacion,
        semilleroInvestigacion: this.validateForm.value.semilleroInvestigacion,
        estadoProceso: 'Pendiente',
        estudiante: [
          this.validateForm.value.integrante1,
          this.validateForm.value.integrante2,
          this.validateForm.value.integrante3
        ].filter(integrante => integrante) // Filtra los valores vacíos 
      };   
      const formData = new FormData();
      formData.append('nombreDocumento', this.fileTmp.fileRaw);
      formData.append('titulo', this.dataProject.titulo);  
      formData.append('fecha', this.dataProject.fecha);
      formData.append('proceso', this.dataProject.proceso);
      formData.append('estadoProceso', this.dataProject.estadoProceso);
      console.log("estudiantes asociados ...", this.dataProject.estudiante);
      formData.append('estudiante', this.dataProject.estudiante)
      this.proyectoService.guardarProyecto(formData).subscribe( data => {
          this.msg.success('Datos cargados con exito');
          console.log("Datos guardados...",data.data);
          this.proyectoService.agregarProcPropuestaGrado(true);
          this.proyectoService.setIdProyecto(data.data._id);
          this.proyectoService.setProceso(data.data.proceso);
          this.proyectoService.setEstadoPropuesta('Pendiente');
          this.SolicitudPropuesta = false;
          this.datoProyecto = data.data;
          this.TablaEstado = true;
      }); 
    }

    //--------------Cargar solicitud del director---------------------------------
    beforeUpload = (file: NzUploadFile): boolean => {
      this.fileList = this.fileList.concat(file);
      return false;
    };
  
    handleUpload(): void {
      const formData = new FormData();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.fileList.forEach((file: any) => {
        formData.append('files[]', file);
      });
      this.uploading = true;
      // You can use any AJAX library you like
      const req = new HttpRequest('POST', 'https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, {
        // reportProgress: true
      });
      this.http
        .request(req)
        .pipe(filter(e => e instanceof HttpResponse))
        .subscribe(
          () => {
            this.uploading = false;
            this.fileList = [];
            this.msg.success('subido con exito.');
          },
          () => {
            this.uploading = false;
            this.msg.success('subido con exito.');
            //this.msg.error('upload failed.');
          }
        );
    }
   
//Botones    
    Cancelar(){
      this.msg.warning('Cancelar formulario');
    }

}
