import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/entidades/role';
import { AuthService } from 'src/app/servicios/auth.service';
import { UsuarioService } from 'src/app/servicios/usuario.service';
import swal from 'sweetalert2';
import { Usuario } from '../../../../entidades/usuario';
import { Location } from '@angular/common';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrls: ['./crear-usuario.component.css'],
})
export class CrearUsuarioComponent implements OnInit {
  public usuario: Usuario = new Usuario();
  form: FormGroup;
  idUser:any;
  rolesAll:Role[];
  isCambiarContra = false;
  activatedId:number;

  get isAdmin(){
    return this.authService.hasRole('ROLE_ADMIN');
  }

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location
  ) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['D3lt@123', Validators.required],
      email: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      nrodoc: ['', Validators.required],
      roles: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.idUser = this.authService.usuario.id;
    console.log('ID usuario..: ' + this.idUser);
    this.cargarUsuario();
    this.usuarioService.getRoles().subscribe(roles=>{
      this.rolesAll = roles;
    })
  }

  cargarUsuario():void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.activatedId = id;

        this.usuarioService.getUsuario(id)
            .subscribe((usuario) => {
              this.usuario = usuario;
              console.log('Cargar usuario: ' + this.usuario.id);
              //this.flag_act = true;
              this.form.get('username').setValue(usuario.username);
              this.form.get('email').setValue(usuario.email);
              this.form.get('nombre').setValue(usuario.nomper);
              this.form.get('apellido').setValue(usuario.apeper);
              this.form.get('nrodoc').setValue(usuario.nrodoc);
              this.form.get('roles').setValue(usuario.roles.map(role => role.id));
              this.isCambiarContra = true;
            });
        console.log('retorno');
      }
    })
  }

  agregarUsuario():void{
    console.log('Agregar usuario: ' + this.usuario.id);

    this.usuario.nomper = this.form.value.nombre;
    this.usuario.apeper = this.form.value.apellido;
    this.usuario.email = this.form.value.email;
    this.usuario.nrodoc = this.form.value.nrodoc;
    this.usuario.username = this.form.value.username;
    this.usuario.roles = this.rolesAll.filter(role =>  this.form.value.roles.includes(role.id));
    
    if(!this.usuario.id) {

      this.usuario.enabled = true;
      this.usuario.password = 'D3lt@123';

      this.usuarioService.create(this.usuario).subscribe(
        persona => {
          this.router.navigate(['/dashboard/users']);
          console.log(persona) //NO RECONOCE LA PERSONA
          //swal('Nuevo Usuario',`Usuario creado con éxito..!..${usuario.id}`,'info') //ESTO DA ERROR PORQUE PERSONA VIENE COMO UNDEFINED...
        }
      )
    }else{
      this.usuarioService.update(this.usuario).subscribe(
        data => {
          if(!this.authService.hasRole('ROLE_USER')){
            this.router.navigate(['/dashboard/users']);
          }
          swal('Actualización Usuario',`Usuario actualizado con éxito..!..${data.id}`,'info')
        }
      );
      console.log(this.usuario.id)
    }
  }

  test(){
    console.log(this.form.value)
  }
}
