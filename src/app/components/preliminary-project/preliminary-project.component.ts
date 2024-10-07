import { Component } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { filter } from 'rxjs/operators';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-preliminary-project',
  templateUrl: './preliminary-project.component.html',
  styleUrl: './preliminary-project.component.css'
})
export class PreliminaryProjectComponent {
  SolicitudPropuesta =true;
  TablaEstado= false;
  switchValue = false;
  DivSwitch = true;
  idproject:string='';
  estadoProyecto: string='';
  proceso: string='';
  private fileTmp:any;
  datoProyecto: any = {};
    //Paneles
    panels1 = [
      {
        active: false,
        disabled: false,
        name: 'Anteproyecto de Grado',
      }
    ];
    panels2 = [
      {
        active: false,
        disabled: false,
        name: 'Presentacion Anteproyecto de Grado',
      }
    ];
    panels3 = [
      {
        active: false,
        disabled: false,
        name: 'Aval del Anteproyecto de Grado',
      }
    ];
  
  
    //contenido del panel 1
    uploading = false;
    fileList: NzUploadFile[] = [];
  
    constructor(private http: HttpClient, 
      private msg: NzMessageService,
      private proyectoService: ProyectoService,
      private userServis: UsersService,

    ) {}


    
  ngOnInit(): void {
  
     const dato = this.proyectoService.procAnteproyecto;

     console.log("dato", dato);
     if(dato){
       this.proceso = this.proyectoService.getAnteproyecto();
       this.idproject=this.proyectoService.getIdAnteproyecto();
       this.estadoProyecto = this.proyectoService.getEstadoAnteproyecto();
     }
    
     console.log("idproject", this.idproject);
    if(this.proceso == 'Anteproyecto' && (this.estadoProyecto == 'Pendiente' || this.estadoProyecto == 'Aprobado')){
     this.SolicitudPropuesta=false;
     this.TablaEstado = true;
     this.switchValue = false;
     this.DivSwitch = false;
     this.proyectoService.datoProyecto(this.idproject).subscribe(data=>{
       this.datoProyecto = data;
 
     }); 
    } 

  }

    getfile($event: any):void{
      const [ file ] = $event.target.files;
        this.fileTmp = {
          fileRaw:file
        }
      }
  
    SubirArchivoDirector(): void {
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
            this.msg.success('Archivo cargado exitosamente.');
          },
          () => {
            this.uploading = false;
            //this.msg.error('upload failed.');
            this.msg.success('Archivo cargado exitosamente.');
          }
        );
    }
    //Formulario del trabajo de grado
     handleChange(info: NzUploadChangeParam): void {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.msg.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        this.msg.error(`${info.file.name} file upload failed.`);
      }
    }
    

    ///Subir archivo Director y/o cordinador
    AntesCargarDirector = (file: NzUploadFile): boolean => {
      this.fileList = this.fileList.concat(file);
      return false;
    };

    GuardarTrabajo(){

      this.proyectoService.datoProyecto(this.proyectoService.getIdProyecto()).subscribe(data => {
        console.log("Se obtiene el siguiente proyecto: ", data)
        const formData = new FormData();
        formData.append('nombreDocumento', this.fileTmp.fileRaw);
        formData.append('titulo', data.titulo);  
      formData.append('fecha', new Date().toISOString());
      formData.append('proceso', 'Anteproyecto');
      formData.append('estadoProceso', 'Pendiente');
      console.log("estudiantes asociados ...", data.estudiante);
      let students: string[] = []; // Inicializa como un array

      data.estudiante.forEach((est: any) => {
        console.log("Se tiene el objeto", est)
        students.push(est._id); // Agrega cada estudiante al array
      });

      // Conviertes el array a una cadena separada por comas
      let studentsString = students.join(',');
      formData.append('estudiante', studentsString);
      this.proyectoService.guardarProyecto(formData).subscribe( data => {
          this.msg.success('Datos cargados con exito');
          console.log("Datos guardados...",data.data);
          this.proyectoService.agregarProcAnteproyecto(true);
          this.proyectoService.setIdAnteproyecto(data.data._id);
          this.proyectoService.setAnteproyecto(data.data.proceso);
          this.proyectoService.setEstadoAnteproyecto('Pendiente');
          this.SolicitudPropuesta = false;
          this.TablaEstado = true;
          this.switchValue = false;
          this.DivSwitch = false;
          this.datoProyecto = data.data;
      }); 
      })
      
    }
  ///////////////////////////////////////////////////////////////
  project = {
    nameProject: '',
  }
    /*Fecha*/
    date = new Date();
    fecha = this.date;
    /*Nombre del proyecto*/

  

 
}
