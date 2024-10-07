import { Component } from '@angular/core';
import { NzCascaderOption } from 'ng-zorro-antd/cascader';
import { NzModalService } from 'ng-zorro-antd/modal';

const options = [
  //primera
  {
    value: '01',
    label: 'Proceso',
    children: [
      {
            value: '001',
            label: 'Propuesta',
            isLeaf: true
      },
      
        {
            value: '002',
            label: 'Anteproyecto',
            isLeaf: true
        },
        
          {
            value: '003',
            label: 'Proyecto final',
            isLeaf: true
          },
        ]
      },
    
  //segunda
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
            isLeaf: true
          }
        ]
      }
    ]
  }
];
interface ItemData {
  id: string;
  proyecto: string;

}


@Component({
  selector: 'app-preliminay-project-jurado',
  templateUrl: './preliminay-project-jurado.component.html',
  styleUrl: './preliminay-project-jurado.component.css'
})
export class PreliminayProjectJuradoComponent {
  value?: string;
  constructor(private modal: NzModalService) {}
  i = 0;
  editId: string | null = null;
  listOfData: ItemData[] = [];
  selectedValue = null;

  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};


  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
  }

  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
      {
        id: `${this.i}`,
        proyecto: `Desarrollar ua aplicación web para la gestión de los trabajos
        de grado de la Universidad de Santander, udes campus Cúcuta${this.i}`,
      }
    ];
    this.i++;
  }

  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter(d => d.id !== id);
  }

  ngOnInit(): void {
    this.addRow();
    this.addRow();
  }

  //FILTRO

  nzOptions: NzCascaderOption[] = options;
  values: string[] | null = null;

  onChanges(values: string[]): void {
    console.log(values, this.values);
  }
}
