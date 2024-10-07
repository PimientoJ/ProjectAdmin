import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  url:string = "http://localhost:3500/api";
 
  constructor(private http: HttpClient, private cookies: CookieService) { }

  //Datos de los usuarios con rol de estudiante
  getUserStuden(): Observable<any>{
    return this.http.get<any>(this.url+"/seira/datosUsuarioEstudiante/");
  }




 /* guardarProyecto(projectData: any): Observable<any>{
    return this.http.post<any>("http://localhost:3500/api/registarProyecto", projectData);
  }*/
}
