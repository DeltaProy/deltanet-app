import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Usuario } from '../entidades/usuario'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _usuario: Usuario;
  private _token: string;

  constructor(private http: HttpClient) { }

  public get usuario(): Usuario {
    if (this._usuario != null){
      return this._usuario;
    } else if(this._usuario == null && sessionStorage.getItem('usuario') != null){
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string {
    if (this._token != null){
      return this._token;
    }else if(this._token == null && sessionStorage.getItem('token') != null){
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  guardarUsuario(accessToken: string):void{
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Usuario();
    this._usuario.id = payload.id_persona;
    this._usuario.nombre = payload.nombre_persona;
    this._usuario.apellido = payload.apellido_persona;
    this._usuario.email = payload.email_persona;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem('usuario',JSON.stringify(this._usuario));
  }

  guardarToken(accessToken: string): void{
    this._token = accessToken;
    sessionStorage.setItem('token',accessToken);
  }

  obtenerDatosToken(accessToken: string): any{
    if(accessToken != null){
      return JSON.parse(atob(accessToken.split('.')[1]));
    }
    return null;
  }

  login(usuario: Usuario):Observable<any> {
    //const urlEndPoint = 'http://173.255.202.95:8085/oauth/token';
    const urlEndPoint = 'http://localhost:8085/oauth/token';
    const credenciales = btoa('deltanetapp' + ':' + 'D3lt@372');
    const httpHeaders = new HttpHeaders({'Content-Type':'application/x-www-form-urlencoded',
          'Authorization':'Basic ' + credenciales});
    let params = new URLSearchParams();
    params.set('grant_type','password');
    params.set('username', usuario.username);
    params.set('password',usuario.password);

    return this.http.post<any>(urlEndPoint,params.toString(),{headers: httpHeaders});
  }

  isAuthenticated(): boolean{
    let payload = this.obtenerDatosToken(this.token);
    if(payload != null && payload.user_name && payload.user_name.length>0){
      return true;
    }
    return false;
  }

  logout():void {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }

  hasRole(role:string):boolean {
    if(this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }
}
