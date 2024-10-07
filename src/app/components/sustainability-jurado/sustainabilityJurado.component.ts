import { Component, OnInit } from '@angular/core';
import { ProyectoService } from 'src/app/services/proyecto.service';

interface ItemData {
  numero: string;
  proyecto: string;
  proceso: string;
  estado: string;
  nota: number;
}

@Component({
  selector: 'app-sustainability',
  templateUrl: './sustainabilityJurado.component.html',
  styleUrl: './sustainabilityJurado.component.css'
})

export class SustainabilityJuradoComponent implements OnInit{
  isVisible: boolean = false;
  listOfData: ItemData[] = [];
  projects: any;
  projectId: any;

  calificacion = 1;

  constructor( public projectService: ProyectoService ) {}
  ngOnInit(): void {
    this.projectService.proyectos().subscribe( (data: []) => {
      this.projects = data;
    })
  }

  showModal() {
    this.isVisible = true;
  }

  handleOk(calificacion: any): void {
    console.log('Calificación', calificacion);
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

}
