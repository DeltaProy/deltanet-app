import { Component, OnInit, ViewChild } from '@angular/core';
import { Solicitud } from '../../../entidades/solicitud';
import { SolicitudService } from '../../../servicios/solicitud.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import swal from 'sweetalert2';

@Component({
  selector: 'app-solusers',
  templateUrl: './solusers.component.html',
  styleUrls: ['./solusers.component.css']
})
export class SolusersComponent implements OnInit {
  public ListSolicitud : Solicitud[];

  displayedColumns: string[] = ['id', 'titulo', 'desTitulo', 'createAt','acciones'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private solicitudService: SolicitudService) { }

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData(): void{
    this.solicitudService.getSolicitudes().subscribe(solicitudes => {
      this.dataSource = new MatTableDataSource<any>(solicitudes)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminarSolicitud(solicitud: Solicitud):void{
    console.log(solicitud.id);
    console.log(solicitud.titulo);
    swal({
      title: 'Estas seguro?',
      text: `Seguro que desea eliminar la solicitud ${solicitud.id} ?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar'
      //confirmButtonClass: 'ancho button',
      //cancelButtonClass: 'btn btn-danger',
      //buttonsStyling: false,
      //reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.solicitudService.delete(solicitud.id).subscribe(
          response => {
            this.cargarData();
            console.log(response.id);
            //this.clientes = this.clientes.filter(cli => cli != cliente)
            swal(
              'Solicitud Eliminada!',
              `Solicitud ${solicitud.id} eliminado con éxito`,
              'success'
            )
          }
        )
      }
    });
  }

}
