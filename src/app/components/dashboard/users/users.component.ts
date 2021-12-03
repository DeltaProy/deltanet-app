import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import swal from 'sweetalert2';
import { UsuarioService } from '../../../servicios/usuario.service';
import { Usuario } from '../../../entidades/usuario';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nombre', 'apellido', 'doc','email', 'acciones'];
  dataSource = new MatTableDataSource<Usuario>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData(): void{
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.dataSource = new MatTableDataSource<any>(usuarios)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource.data)
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  eliminarUsuario(usuario: Usuario):void{
    console.log(usuario.id);
    console.log(usuario.nomper);
    
    swal({
      title: 'Estas seguro?',
      text: `Seguro que desea eliminar el usuario ${usuario.id} ?`,
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
        this.usuarioService.delete(usuario.id).subscribe(
          response => {
            this.cargarData();
            console.log(response.id);
            //this.clientes = this.clientes.filter(cli => cli != cliente)
            swal(
              'Usuario Eliminado!',
              `Usuario ${usuario.id} eliminado con éxito`,
              'success'
            )
          }
        )
      }
    });
  }

}
