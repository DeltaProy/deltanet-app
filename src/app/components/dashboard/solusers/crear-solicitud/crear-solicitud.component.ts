import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {
  foods: any[] = [
    {value: 1, viewValue: 'Steak'},
    {value: 2, viewValue: 'Pizza'},
    {value: 3, viewValue: 'Tacos'},
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
