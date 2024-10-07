import { Injectable} from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Injectable({
  providedIn: 'root'
  
})
export class JwtInterceptor implements HttpInterceptor {

constructor( private usersService: UsersService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
  const token= this.usersService.getToken();
  const auth = req.clone({headers: req.headers.set('Authorization', `Bearer ${token}`)})
     
    console.log("Enviojwt:", auth)
    return next.handle(auth);
  }
}
