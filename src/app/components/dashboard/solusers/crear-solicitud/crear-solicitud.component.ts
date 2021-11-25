import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudService } from '../../../../servicios/solicitud.service';
import { Area } from '../../../../entidades/area';
import { Solicitud } from '../../../../entidades/solicitud';
import { ListEstado } from '../../../../entidades/estado';
import swal from 'sweetalert2';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {
  public solicitud: Solicitud = new Solicitud();
  areas: Area[];
  estado: ListEstado = {
    "id": 2,
    "descrip": "asignado"
   };
  form: FormGroup;

  constructor(private solicitudService: SolicitudService,
              private router: Router,
              private fb: FormBuilder) {
      this.form = this.fb.group({
          titulo: ['', Validators.required],
          destitulo: ['', Validators.required],
          area: ['', Validators.required]
      });
  }

  ngOnInit(): void {
    this.solicitudService.getAreas().subscribe(areas => this.areas = areas);
    this.solicitudService.getEstado(1).subscribe(estado => this.estado = estado);
  }

  obtenerEstado(id:number):void{
    this.solicitudService.getEstado(id).subscribe(estado => {
      console.log("-->" + estado.descrip);
      this.estado = estado;
    });
  }

  agregarSolicitud():void{
    //console.log(this.form);
    this.solicitud.estadoSolic = this.estado;
    this.solicitud.titulo = this.form.value.titulo;
    this.solicitud.desTitulo = this.form.value.destitulo;
    this.solicitud.area = this.form.value.area;
    this.solicitud.idcrea = 1;
    this.solicitudService.create(this.solicitud).subscribe(
      solicitud => {
        this.router.navigate(['/dashboard']);
        swal('Nueva Solicitud','Solicitud creada con éxito..!','info')
      }
    );
  }

}
