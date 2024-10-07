import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProyectoService } from 'src/app/services/proyecto.service';
import { NzModalService } from 'ng-zorro-antd/modal';

interface ItemData {
  numero: string;
  proyecto: string;
  proceso: string;
  estado: string;
  nota: number;
}
@Component({
  selector: 'app-proposed-grade-admin',
  templateUrl: './proposed-grade-admin.component.html',
  styleUrl: './proposed-grade-admin.component.css'
})
export class ProposedGradeAdminComponent {

  @ViewChild('txtBuscarProyecto') txtBuscarProyecto!: ElementRef<HTMLInputElement>

  isVisible = false;
  checked = true;
  projects: any;
  projectId: any;
  //value?: string;
  constructor( public projectService: ProyectoService, private  modal:NzModalService, )
  {}
  
  listOfData: ItemData[] = [];
  i = 0;
  demoValue = 1.0;
  comentario:string = '';
  estado:string = '';
  proceso:string = '';
  idproject: string = '';
  nameProject: string = '';

  ngOnInit(): void {
   this.llenardatos();
  }
 llenardatos(){
  this.projectService.proyectos().subscribe( (data: []) => {
    this.projects = data;
    this.projects.forEach((project: any) => {
        // console.log(project.estadoProceso)
        if( project.estadoProceso === 'Aprobado' ) {
          this.checked = true;
        }
    });
  })
 }
  buscarProyecto() {
    const nombre = this.txtBuscarProyecto.nativeElement.value;
    this.projectService.proyectosPorTitulo(nombre)
      .subscribe( (data: []) => {
        console.log(data);
        this.projects = data;
      })
  }

  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
     /* {
        numero: `${this.i}`,
        proyecto: `${this.i}`,
        proceso: ``,
        estado: ``,
        nota:
      },*/
    ];
    this.i++;
  }

  showModal(id: string): void {
    this.idproject = id;
    //traer el proyecto correspondiente al ID
    this.projectService.datoProyecto(id).subscribe( data => {
      this.projectId = data;
      this.demoValue = data.nota;
      this.comentario = data.comentario;
    })
    this.isVisible = true;
  }

  handleOk(): void {
    console.log("nota", this.demoValue);
    if(this.demoValue >= 3.5 ){
      this.estado = 'Aprobado'
      console.log("estado", this.estado);
    }if(this.demoValue <= 3.4  && this.demoValue >= 3.0){
      this.estado = 'Aplazada'
      console.log("estado", this.estado);
    }else if(this.demoValue <= 3.0 ){
      this.estado = 'Rechazada'
      console.log("estado", this.estado);
    }
    const data={
      nota: this.demoValue,
      comentario: this.comentario,
      estadoProceso: this.estado
    }

    this.projectService.actualizarProyecto(this.idproject, data).subscribe(data=>{
      console.log("resultado", data);
        if (data.success) {
          this.modal.success({
            nzTitle: '¡Registro con exito!',
            nzContent: 'El usuaio se ha creado con exito'
          });
          this.llenardatos();
        }
    })    
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  async onCheckboxChange(event: any, estado: string, id: string) {
    console.log('id', id)
    if(event.target.checked) {
      this.projects.estadoProceso = estado;
      this.projectId.estadoProceso = estado;
      console.log(this.projectId);
      await this.projectService.actualizarEstado(id, this.projectId).subscribe( data => {
        
        console.log('Actualizado Estado!!');
      })
      
    } else {
      console.log('Desmarcado')
    }
  }

  async onCheckboxChangeProceso(event: any, proceso: string, id: string) {
    console.log('id', id)
    console.log('proceso', proceso)
    if(event.target.checked) {
      this.projects.proceso = proceso;
      this.projectId.proceso = proceso;
      console.log(this.projectId);
      await this.projectService.actualizarEstado(id, this.projectId).subscribe( data => {
        console.log('Actualizado proceso!!');
      })
      
    } else {
      console.log('Desmarcado')
    }
  }

  downloadFile(id: string): void {
    window.open(`http://localhost:3500/api/descargarArchivo/${id}`, '_blank');
  }

  previewFile(id: string): void {
    window.open(`http://localhost:3500/api/verArchivo/${id}`, '_blank');
  }
  
  
}
