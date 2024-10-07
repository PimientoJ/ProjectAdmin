import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { filter } from 'rxjs/operators';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { UsersService } from 'src/app/services/users.service';
import { NonNullableFormBuilder } from '@angular/forms';
 

@Component({
  selector: 'app-sustainability',
  templateUrl: './sustainability.component.html',
  styleUrl: './sustainability.component.css'
})

export class SustainabilityComponent {
  SubirArchivo=true;
  Calificacion=false;
  uploading = false;
  fileList: NzUploadFile[] = [];
  private dataProject:any;
  private fileTmp:any;
  SolicitudPropuesta:boolean =true;
  TablaEstado:Boolean= false;
  datoProyecto: any = {};

  constructor(private http: HttpClient, private msg: NzMessageService,
      private proyectoService: ProyectoService,
      private userServis: UsersService,
      private fb: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    console.log(this.proyectoService.getIdProyecto());
  }

  enviarDatosProyecto(){
    
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

   getfile($event: any):void{
    const [ file ] = $event.target.files;
      this.fileTmp = {
        fileRaw:file
      }
    }

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
          this.msg.success('Archivo cargado exitosamente.');
        },
        () => {
          this.uploading = false;
          //this.msg.error('error al subir archivo.');
          this.msg.success('Archivo cargado exitosamente.');
          //Temporal
          this.SubirArchivo=false;
          this.Calificacion=true;
        }
      );
  }

}
