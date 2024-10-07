import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private procesoPropuestaGrado = false;
  private procesoSustentacion = false;
  private procesoAnteproyecto = false;
  private procesoTrabajoFinal = false;


  url:string = "http://localhost:3500/api";

  constructor(private http: HttpClient, private cookies: CookieService) { }

  get procPropuestaGrado(){
      return this.procesoPropuestaGrado;
  }
  agregarProcPropuestaGrado(dato: boolean){
    this.procesoPropuestaGrado = dato;
  }

  get procSustentacion(){
    return this.procesoSustentacion;
}
agregarProcSustentacion(dato: boolean){
  this.procesoSustentacion = dato;
}

get procAnteproyecto(){
  return this.procesoAnteproyecto;
}
agregarProcAnteproyecto(dato: boolean){
this.procesoAnteproyecto = dato;
}

get procTrabajoFinal(){
  return this.procesoTrabajoFinal;
}
agregarProcTrabajoFinal(dato: boolean){
this.procesoTrabajoFinal = dato;
}

  //-------------Proyecto----------------

  //Obtener los datos del proyecto
  proyectos():Observable<any>{
    return this.http.get<any>(this.url+"/datosproyecto");
  }

//Guardar un nuevo proyecto
  guardarProyecto(FormData: FormData): Observable<any>{
    return this.http.post(this.url+"/registarProyecto", FormData);
  }

  //Actualizar datos del proyecto
  actualizarProyecto(id: any, data: any): Observable<any>{
    return this.http.put(this.url+"/actualizarProyecto/"+id, data);
  }
//Eliminar un proyecto
  eliminarProyecto(id: any): Observable<any>{
    return this.http.delete(this.url+"/eliminarProyecto/"+id);
  } 
  //Guardar integrantes del proyecto
  getEstudianteProyecto(idProyecto: any, idstuden: any):Observable<any>{
    return this.http.put<any>(this.url+`/registarUsuarioProyecto/${idProyecto}`, idstuden);
  }
  //datos de un proyecto
  datoProyecto(id: any):Observable<any>{
    return this.http.get<any>(this.url+"/datoproyecto/"+id);
  }
  //Obtener los inetgrantes del proyecto
  datoEstudianteProyecto(id: any):Observable<any>{
    return this.http.get<any>(this.url+"/datoEstudianteproyecto/"+id);
  }
    //Obtener los jueces del proyecto
    datoJuezProyecto(id: any):Observable<any>{
      console.log("id que recibo dle proyecto", id)
      return this.http.get<any>(this.url+"/datoJuradoproyecto/"+id);
    }
    //Descargar pdf proyecto
    getPDF(id:any) {
      return this.http.get( this.url+`${id}`,
          { responseType: 'blob' as 'json', observe: 'response' }
      );
   }
  proyectosPorTitulo(nombre: string) {
    return this.http.get<any>(this.url+`/nombreproyecto/${nombre}`);
  }

  

  actualizarEstado(id: string, data: any):Observable<any> {
    return this.http.put<any>(this.url+`/actualizarProyecto/${id}`, data);
  }

//----------------guarda el id del proyecto--------------
setIdProyecto(idProyecto: any){
  localStorage.setItem('idProyecto', JSON.stringify(idProyecto));
}
getIdProyecto(){ 
  return JSON.parse(localStorage.getItem('idProyecto') || '');
}
//----------------Guarda el proceso del proyecto---------------
  setProceso(proceso: any){
    localStorage.setItem('Proceso', JSON.stringify(proceso));
  }
  getProceso(){ 
    return JSON.parse(localStorage.getItem('Proceso') || '');
  }
 
  setEstadoPropuesta(proceso: any){
    localStorage.setItem('estadoPropuesta', JSON.stringify(proceso));
  }
  getEstadoPropuesta(){ 
    return JSON.parse(localStorage.getItem('estadoPropuesta') || '');
  }


  //----------------guarda el id del sustentacion--------------
setIdSustentacion(idProyecto: any){
  localStorage.setItem('idSustentacion', JSON.stringify(idProyecto));
}
getIdSustentacion(){ 
  return JSON.parse(localStorage.getItem('idSustentacion') || '');
}
//----------------Guarda el proceso de la sustentacion---------------
  setSustentacion(proceso: any){
    localStorage.setItem('Sustentacion', JSON.stringify(proceso));
  }
  getSustentacion(){ 
    return JSON.parse(localStorage.getItem('Sustentacion') || '');
  }
 
  setEstadoSustentacion(proceso: any){
    localStorage.setItem('estadoSustentacion', JSON.stringify(proceso));
  }
  getEstadoSustentacion(){ 
    return JSON.parse(localStorage.getItem('estadoSustentacion') || '');
  }

   //----------------guarda el id del anteproyecto--------------
setIdAnteproyecto(idProyecto: any){
  localStorage.setItem('idAnteproyecto', JSON.stringify(idProyecto));
}
getIdAnteproyecto(){ 
  return JSON.parse(localStorage.getItem('idAnteproyecto') || '');
}
//----------------Guarda el proceso de la sustentacion---------------
  setAnteproyecto(proceso: any){
    localStorage.setItem('Anteproyecto', JSON.stringify(proceso));
  }
  getAnteproyecto(){ 
    return JSON.parse(localStorage.getItem('Anteproyecto') || '');
  }
 
  setEstadoAnteproyecto(proceso: any){
    localStorage.setItem('estadoAnteproyecto', JSON.stringify(proceso));
  }
  getEstadoAnteproyecto(){ 
    return JSON.parse(localStorage.getItem('estadoAnteproyecto') || '');
  }

   //----------------guarda el id del anteproyecto--------------
setIdProyectoFinal(idProyecto: any){
  localStorage.setItem('idProyectoFinal', JSON.stringify(idProyecto));
}
getIdProyectoFinal(){ 
  return JSON.parse(localStorage.getItem('idProyectoFinal') || '');
}
//----------------Guarda el proceso de la sustentacion---------------
  setProyectoFinal(proceso: any){
    localStorage.setItem('ProyectoFinal', JSON.stringify(proceso));
  }
  getProyectoFinal(){ 
    return JSON.parse(localStorage.getItem('ProyectoFinal') || '');
  }
 
  setEstadoProyectoFinal(proceso: any){
    localStorage.setItem('estadoProyectoFinal', JSON.stringify(proceso));
  }
  getEstadoProyectoFinal(){ 
    return JSON.parse(localStorage.getItem('estadoProyectoFinal') || '');
  }


}
