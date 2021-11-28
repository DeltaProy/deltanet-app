import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from '../entidades/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlEndPoint: string = 'http://localhost:8085/apiUser/usuarios';

  constructor(private http: HttpClient) { }

  getUsuario(id:number): Observable<Usuario>{
    let params = new HttpParams();
    params = params.append("id",id);
    return this.http.get<Usuario>(this.urlEndPoint + '/buscaid',{params:params});
  }
}
