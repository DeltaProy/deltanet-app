import { Area } from './area';
import { Usuario } from './usuario';
import { ListEstado } from './estado';

export class Solicitud {
  id:number;
  titulo:string;
  desTitulo:string;
  createAt:string;
  imgsol:string;
  area:Area;
  creado:Usuario;
  asignado:Usuario;
  estadoSolic: ListEstado;
}
