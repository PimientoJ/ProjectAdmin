import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {
  constructor(private http: HttpClient, private cookies: CookieService) { }

  url:string = "http://146.190.62.222:3500/api";

  getProcesos(): Observable<any>{
    return this.http.get<any>(this.url+"/visualizarProceso");
  }

  getProceso(idProceso: any): Observable<any>{
    return this.http.get<any>(this.url+"/consultarProceso/"+idProceso);
  }

  postProcesos(body: any): Observable<any>{
    return this.http.post<any>(this.url+"/agregarProcesoNuevo", body);
  }

  putProceso(idProceso: any, body: any):Observable<any>{
    return this.http.put<any>(this.url+"/actualizarProceso"+idProceso, body);
  }

  deleteProceso(idProceso: any):Observable<any>{
    return this.http.delete<any>(this.url+"/eliminarProceso/"+idProceso);
  }
}
