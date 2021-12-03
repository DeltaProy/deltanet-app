import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../servicios/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  get isAdmin(){
    return this.authService.hasRole('ROLE_ADMIN');
  }

  get idUser(){
    return this.authService.usuario.id;
  }

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
  }

}
