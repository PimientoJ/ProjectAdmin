import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { ProyectoService } from 'src/app/services/proyecto.service';

@Component({
  selector: 'app-proposed-grade-jurado',
  templateUrl: './proposed-grade-jurado.component.html',
  styleUrl: './proposed-grade-jurado.component.css'
})
export class ProposedGradeJuradoComponent implements OnInit{

  nombreProyecto:string ='';
  comentario:string ='';
  datoProyecto:any={};
  TablaEstado:Boolean= false;
  Userintegrante1:string = '';
  idUserIntegrante1:string = '';

  constructor(
    public userService: UsersService,
    public proyectoService: ProyectoService) {}


  ngOnInit(): void {
    const usuario = this.userService.getUserLogueId();
    console.log("el usuario es: ", usuario)
    this.userService.getUserLogged(usuario).subscribe(data=> {    
      this.Userintegrante1 = data.nombre;
      this.idUserIntegrante1 = data._id;
     })
     console.log("id de usuario es: ", this.idUserIntegrante1);
    this.proyectoService.proyectos().subscribe(data =>{
      console.log("Estoy encontrando esta informacion: ",data)
      this.datoProyecto = data.filter((proyecto: any) => 
        Array.isArray(proyecto.estudiante) && 
        proyecto.estudiante.some((estudiante: any) => estudiante._id === usuario)
    );
      this.TablaEstado = true;
    });
  }
  
}
