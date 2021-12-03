import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { Usuario } from '../entidades/usuario';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { Role } from '../entidades/role';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private urlEndPoint: string = 'http://localhost:8085/apiUser/usuarios';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
    ) { }

  private isNoAutorizado(e:any):boolean{
    if(e.status == 401){
      /*----------------------------------------------
      Si esta autenticado pero arrojo error 401, indica
      que el token ha expirado
      ----------------------------------------------*/
      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }
      this.router.navigate(['/login']);
      return true;
    }
    if(e.status == 403){
      swal('Acceso Denegado',`Hola ${this.authService.usuario.username} no tiene acceso a este recurso`,'warning');
      this.router.navigate(['/dashboard']);
      return true;
    }
    return false;
  }

  getUsuario(id:number): Observable<Usuario>{
    let params = new HttpParams();
    params = params.append("id",id);
    return this.http.get<Usuario>(this.urlEndPoint + '/buscaid',{params:params});
  }

  getUsuarios(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.urlEndPoint + '/all');
  }

  create(usuario: Usuario): Observable<Usuario>{
    return this.http.post<Usuario>(this.urlEndPoint, usuario).pipe(
      map((response:any) => response.usuario as Usuario),
      catchError(e => {
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        if(e.status == 400){
          return throwError(e);
        }
        swal('Error al crear la solicitud', e.error.mensaje,'error')
        return throwError(e);
      })
    );
  }

  update(usuario: Usuario): Observable<Usuario>{
    return this.http.put<Usuario>(`${this.urlEndPoint}/${usuario.id}`,
      usuario).pipe(
        map((response:any) => response.usuario as Usuario),
        catchError(e => {
          if(this.isNoAutorizado(e)){
            return throwError(e);
          }
          if(e.status == 400){
            return throwError(e);
          }
          swal('Error al actualizar el usuario',e.error.mensaje,'error');
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Usuario> {
    return this.http.delete<Usuario>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        swal('Error al eliminar la solicitud', e.error.mendaje, 'error');
        return throwError(e);
      })
    );
  }

  cambiarContraseña(usuario:Usuario): Observable<Usuario>{
    return this.http.put<Usuario>(`${this.urlEndPoint}/cambioContra`, usuario).pipe(
      map((response:any) => response.usuario as Usuario),
      catchError(e => {
        if(this.isNoAutorizado(e)){
          return throwError(e);
        }
        if(e.status == 400){
          return throwError(e);
        }
        swal('Error al actualizar la contraseña',e.error.mensaje,'error');
        return throwError(e);
      })
    )
  }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(this.urlEndPoint + '/roles');
  }
}