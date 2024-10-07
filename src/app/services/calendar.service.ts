import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class CalendarService{

  constructor(private http: HttpClient, private cookies: CookieService) { }

  url:string = "http://localhost:3500/api";

  //----------------Datos de la tabla Calendario--------------

  //Métodos Mostrar datos de la tabla calendario
  getCalendar(): Observable<any>{
    return this.http.get<any>(this.url+"/datosCalendario");
  }

  //Métodos Mostrar datos de la tabla calendario
  getCalendarActivo(): Observable<any>{
    return this.http.get<any>(this.url+"/calendarioActivo");
  }
  //Método para mostrar los procesos activos del calendario
  getProcesos(idCale: any): Observable<any>{
    return this.http.get<any>(this.url+"/datosProcesos/"+idCale);
  }

  

    //----------------Calendario (Procesos de año y periodo)--------------
  //Método para actualizar el año y el periodo
  putCalendario(id: any, data: any): Observable<any>{
    console.log('Enviando datos para actualizar:', data);
    return this.http.put<any>(this.url+"/actualizarCalendario/"+id, data);
  }
    //Métodos guardar el id del calendario
    setCalendarioId(datos: any){
      localStorage.setItem('idCalendario', JSON.stringify(datos));
   }
    getCalendarioId(){
      return JSON.parse(localStorage.getItem('idCalendario') || '');
    }

      //----------------Procesos del calendario--------------

   
    //Método para agregar un proceso al calendario
    postDatosProcesos(idCale: any, body: any): Observable<any>{
      return this.http.post<any>(this.url+"/agregarProcesos/"+idCale, body);
    }
    //Metodo para eliminar un proceso
    deleteDatoProceso(idCale: any, idProceso: any): Observable<any>{
      return this.http.delete<any>(this.url+"/eliminarProceso/"+idCale+"/"+idProceso);
    }
     //Metodo para editar un proceso
    putDatoProceso( idCal:any,  idProceso:any, body:any): Observable <any>{
      return this.http.put<any>(this.url+"/actualizarProcesos/"+idCal+"/"+idProceso, body);
    }
     //Metodo para mostrar un proceso seleccionado
    getDatoDelProceso(idCal: any, idProceso: any): Observable <any>{
      return this.http.get<any>(this.url+"/datoDelProceso/"+idCal+"/"+idProceso);
    }
}
