import { Area } from './area';
import { ListEstado } from './estado';

export class Solicitud {
  id:number;
  titulo:string;
  desTitulo:string;
  createAt:string;
  imgSol:string;
  area:Area;
  idcrea:number;
  idasignado:number;
  estadoSolic: ListEstado;
}