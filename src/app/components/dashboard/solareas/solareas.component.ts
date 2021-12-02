import { Component, OnInit, ViewChild } from '@angular/core';
import { SolicitudService } from '../../../servicios/solicitud.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import swal from 'sweetalert2';
import { Solicitud } from '../../../entidades/solicitud';
import { ListEstado} from '../../../entidades/estado';

@Component({
  selector: 'app-solareas',
  templateUrl: './solareas.component.html',
  styleUrls: ['./solareas.component.css']
})
export class SolareasComponent implements OnInit {
  public ListSolicitud : Solicitud[];
  public estDesest: ListEstado;

  displayedColumns: string[] = ['id', 'titulo', 'desTitulo', 'estadoSolicDescrip' ,'createAt','creadoUsername','acciones'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private solicitudService: SolicitudService) { }

  ngOnInit(): void {
    this.cargarData();
    this.solicitudService.getEstado(5).subscribe(estado => this.estDesest = estado);
  }

  cargarData(): void{
    this.solicitudService.getSolicRecibidas().subscribe(solicitudes => {
      this.dataSource = new MatTableDataSource<any>(solicitudes)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  estadoDesest(solicitud: Solicitud):void{
    solicitud.estadoSolic = this.estDesest;
    this.solicitudService.update(solicitud).subscribe(response =>{

      swal('Actualización Solicitud',`Solicitud actualizada con éxito..!..${response.id}`,'info')
    });
  }

}
