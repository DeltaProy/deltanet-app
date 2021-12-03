import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import { Usuario } from '../../../../entidades/usuario';

@Component({
  selector: 'app-cambio-contra',
  templateUrl: './cambio-contra.component.html',
  styleUrls: ['./cambio-contra.component.css']
})
export class CambioContraComponent implements OnInit {
  form:FormGroup;

  get isAdmin(){
    return this.authService.hasRole('ROLE_ADMIN');
  }
  
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private location: Location,
    private authService: AuthService,
    ) {
      this.form = this.fb.group({
        lastPass: [''],
        newPass: ['', Validators.required],
      });
    }

  ngOnInit(): void {
  }
  
  cambiarContra(){
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      this.usuarioService.getUsuario(id).subscribe(
        usuario => {
          if(this.isAdmin){
            usuario.password = this.form.get('newPass').value;
            this.usuarioService.cambiarContraseña(usuario).subscribe(result => {
              console.log(result);
              this.router.navigate(['/dashboard/users']);
            })
          }else{
            /* let user = new Usuario();
            user.username = usuario.username;
            user.password = this.form.get('lastPass').value; */
            usuario.password = this.form.get('lastPass').value;
            this.authService.login(usuario).subscribe(response => {
              console.log(response)
              console.log('Es la password!!!');

              /* usuario.password = this.form.get('newPass').value;
              this.usuarioService.cambiarContraseña(usuario).subscribe(result => {
                console.log(result);
                this.location.back();
                //poner el swal
              }) */
            },err => {
              console.log(err)
              console.log('no es la password');
            });
          }
        });
    })
  }

  test(){
    let user = new Usuario();
    user.username = 'user6';
    user.password = 'D3lt@123';
    this.authService.login(user).subscribe(response => {
      console.log(response)
      console.log('Es la password!!!');

      /* usuario.password = this.form.get('newPass').value;
      this.usuarioService.cambiarContraseña(usuario).subscribe(result => {
        console.log(result);
        this.location.back();
        //poner el swal
      }) */
    },err => {
      console.log(err)
      console.log('no es la password');
    });
  }

  volver(){
    this.location.back();
  }
}

