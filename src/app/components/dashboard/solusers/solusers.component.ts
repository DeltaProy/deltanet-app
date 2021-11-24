import { Component, OnInit, ViewChild } from '@angular/core';
import { Solicitud } from '../../../entidades/solicitud';
import { SolicitudService } from '../../../servicios/solicitud.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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

}
