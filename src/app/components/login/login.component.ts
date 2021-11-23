import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Usuario } from '../../entidades/usuario';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  user: Usuario;
  loading = false;

  constructor( private fb: FormBuilder,
               private authService: AuthService,
               private router: Router) {
    this.user = new Usuario();
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  ingresar(){
    const usuario = this.form.value.usuario;
    const password = this.form.value.password;

    this.user.username = usuario;
    this.user.password = password;

    this.authService.login(this.user).subscribe(response => {
      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);
      let user = this.authService.usuario;
      //----let payload = JSON.parse(atob(response.access_token.split('.')[1]));
      //this.router.navigate(['/solicitudes']);
      //swal('Login',`Hola ${payload.user_name}, has iniciado sesión con éxito!`,'success');
      //swal('Login',`Hola ${user.username}, has iniciado sesión con éxito!`,'success');
      this.fakeloading();
    },err => {
      if(err.status = 400){
        swal('Error Autenticación','Usuario o contraseña incorrecta','error');
      }
      this.form.reset();
    });
  }

  fakeloading() {
    this.loading = true;
    setTimeout(() => {
      //rdireccionamos al dashboard
      this.loading = false;
    },1500);
  }
}
