import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { UsuarioService } from '../../../../servicios/usuario.service';
import { SolicitudService } from '../../../../servicios/solicitud.service';
import { Usuario } from '../../../../entidades/usuario';
import { Solicitud } from '../../../../entidades/solicitud';
import { ListEstado } from '../../../../entidades/estado';
import swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-solicitud',
  templateUrl: './asignar-solicitud.component.html',
  styleUrls: ['./asignar-solicitud.component.css']
})
export class AsignarSolicitudComponent implements OnInit {

  public ListUsuarios: Usuario[];
  public solicitud: Solicitud;
  public estAsigna: ListEstado;
  public fId: number;
  public fTitulo: string;
  public fcreado: string;
  public fusercrea:string

  displayedColumns: string[] = ['id','nomper','apeper', 'email', 'acciones'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private usuarioService: UsuarioService,
              private solicitudService: SolicitudService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.solicitudService.getEstado(2).subscribe(estado => this.estAsigna = estado);
    this.cargarData();
  }

  cargarData(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.solicitudService.getSolicitud(id)
            .subscribe((solicitud) => {
              this.fId = solicitud.id;
              this.fTitulo = solicitud.titulo;
              this.fcreado = solicitud.createAt;
            });
      }
    })
    this.usuarioService.getUsuariosPorRol("ROLE_USER").subscribe(usuarios => {
      this.dataSource = new MatTableDataSource<any>(usuarios);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  estadoAsigna(usuario: Usuario):void{
    this.solicitudService.getSolicitud(this.fId).subscribe(data => {
      console.log(this.estAsigna.descrip);
      data.estadoSolic = this.estAsigna;
      data.asignado = usuario;
      console.log('Usuario: ' + usuario.apellido);
      this.solicitudService.update(data).subscribe(resp => {
        swal('Actualización Solicitud',`Solicitud actualizada con éxito..!..${resp.id}`,'info')
      });
    });
  }

}
