import { Injectable} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from "ngx-cookie-service";

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  url:string = "http://localhost:3500/api";
 
  constructor(private http: HttpClient, private cookies: CookieService) {}

  Login(user: any): Observable<any>{
    return this.http.post<any>(this.url+"/seira/loginUsuario", user);
  }
  ///---------------------USUARIO-------------------------
//Id del usuario logueado
  setUserLogged(user: any){
     localStorage.setItem('id', JSON.stringify(user));
  }

  getUserLogueId(){ 
    return JSON.parse(localStorage.getItem('id') || '');
  }
 //Datos del usuario logueado
  getUserLogged(id: any): Observable<any>{
    return this.http.get<any>(this.url+"/seira/datosUsuarioLogueado/"+id);
  }
  //Crear usuario desde el admin
  CrearUser(user: any): Observable<any>{
    return this.http.post<any>(this.url+"/seira/registarUsuario", user);    
  }
  //Editar usuario desde el admin
  putUser(iduser: any, data: any): Observable<any>{
    return this.http.put<any>(this.url+"/seira/actualizarUsuario/"+iduser, data);    
  }
  //Eliminar usuario desde el admin
  deleteUser(iduser: any): Observable<any>{
    return this.http.delete<any>(this.url+"/seira/eliminarUsuario/"+iduser);    
  }
 
//Obtener id del usuario creado desde el admin
  setIdUserCreado(user: any){
    console.log("setUserCreadoId", JSON.stringify(user));
    localStorage.setItem('idUserCreado', JSON.stringify(user));
  }
  getIdUserCreado(){ 
    console.log("getUserCreadoId", JSON.parse(localStorage.getItem('idUserCreado') || ''));
    return JSON.parse(localStorage.getItem('idUserCreado') || '');
  }
  //Obtener datos de los usuarios registrados
  getUsers(): Observable<any>{
    return this.http.get<any>(this.url+"/seira/datosUsuarios");
  }
  //Obtener el id del rol de cada usuario
  getRolUsuario(idUser: any, idRol: any):Observable<any>{
    return this.http.get<any>(this.url+"/seira/datosRolUsuario/"+idUser+"/"+idRol);
  }
   //Obtener los usuarios con el rol de estudiante
   getRolEstudiante():Observable<any>{
    return this.http.get<any>(this.url+"/seira/datosUsuarioEstudiante");
  }
  //Obtener los usuarios con el rol de jurado
  getRolJurado():Observable<any>{
    return this.http.get<any>(this.url+"/seira/datosUsuarioJurado");
  }
  //Obtener el nombre del rol de cada usuario
  getNombreRolUsuario(idRol: any):Observable<any>{
    return this.http.get<any>(this.url+"/datoRol/"+idRol);
  }
  //cambiar contraseña
  putPassword(idUser: any, pass: any):Observable<any>{
    return this.http.put<any>(this.url+"/seira/actualizarPassword/"+idUser, pass);
  }
  
//-------------------ROL USUARIO------------------------------
//Guardar rol del usuario creado
  guardarRolUsuarioCreado(idUser: any, idRol: any): Observable<any>{
    console.log("id del rol que llega", idRol);
    return this.http.put<any>(this.url+"/seira/registarRolUsuario/"+idUser, idRol);
  }
//Obtener  los roles
  getDatosRoles(): Observable<any>{
    return this.http.get<any>(this.url+"/datosRoles");
  }

   //---------------------TOKEN----------------------------

//Métodos para guardar token en cookies, para recuperar token y eliminar token
  
  setToken(token:string) {
    this.cookies.set("token", token);
   }  
  getToken(){
    return this.cookies.get("token");
   }
  DeleteToken(){
    return this.cookies.delete("token");
   }
  
}
