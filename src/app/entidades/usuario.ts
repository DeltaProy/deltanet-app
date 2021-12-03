import { Role } from "./role";

export class Usuario {
  id: number;
  username: string;
  password: string;
  nombre: string;
  apellido: string;
  email: string;
  roles: Role[] = [];
  nomper: string;
  apeper: string;
  nrodoc: number;
  enabled: boolean;
}
