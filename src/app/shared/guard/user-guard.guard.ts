import { Injectable, inject} from '@angular/core';
import { Observable } from 'rxjs';
import {ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn} from '@angular/router';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Injectable({
  providedIn: 'root'
  
})

 class userGuard {
  
  constructor(private router: Router, private Users:UsersService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean{
     const cookie = this.Users.getToken();
    if(!cookie){
      this.router.navigateByUrl("/Login");
      return false;
    }else{
      return true;
    }   
  }
 }
  export const userGuardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state:RouterStateSnapshot):boolean => {
    return inject(userGuard).canActivate(route, state);
}
