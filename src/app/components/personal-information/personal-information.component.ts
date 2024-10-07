import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})
export class PersonalInformationComponent implements OnInit{

  users: any = {};
  usersRol: any[] = [];
  

  constructor(public userService: UsersService) {}

  //Metodo para mostrar datos del usuario
  getUserLogged() { 
    const id = this.userService.getUserLogueId(); 
    this.userService.getUserLogged(id).subscribe((data) => {  
      this.users=data;
      this.userService.getNombreRolUsuario(data.rol).subscribe((dataRol) => {
        this.usersRol = dataRol;
       });
      });
  }
  //Metodo de editar
  startEdit(): void {
    
  }
  ngOnInit(): void {
    this.getUserLogged();
  }
}
