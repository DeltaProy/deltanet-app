import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { SolicitudService } from '../../../../servicios/solicitud.service';
import { UsuarioService } from '../../../../servicios/usuario.service';
import { AuthService } from '../../../../servicios/auth.service';
import { Area } from '../../../../entidades/area';
import { Solicitud } from '../../../../entidades/solicitud';
import { ListEstado } from '../../../../entidades/estado';
import { Usuario } from '../../../../entidades/usuario';
import swal from 'sweetalert2';

@Component({
  selector: 'app-crear-solicitud',
  templateUrl: './crear-solicitud.component.html',
  styleUrls: ['./crear-solicitud.component.css']
})
export class CrearSolicitudComponent implements OnInit {
  public solicitud: Solicitud = new Solicitud();
  areas: Area[];
  estado: ListEstado;
  area_sel: Area;
  user_area: Usuario;
  form: FormGroup;
  fileAttr = 'cambia File';
  private fileImagen:File;
  dataimage: any;
  progreso: number = 0;
  idarea:number;
  idUser:any;
  emailUser:any;
  imageToShow: any;
  isImageLoading: boolean;
  flag_act:boolean;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private solicitudService: SolicitudService,
              private usuarioService: UsuarioService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {
      this.form = this.fb.group({
          titulo: ['', Validators.required],
          destitulo: ['', Validators.required],
          area: ['', Validators.required],
          imagen: ['archivo...', Validators.maxLength(100)]
      });
  }

  ngOnInit(): void {
    console.log('Al iniciar: ' + this.solicitud.id)
    this.idUser = this.authService.usuario.id;
    this.emailUser = this.authService.usuario.email;
    console.log('ID usuario..: ' + this.idUser);
    this.solicitudService.getAreas().subscribe(areas => this.areas = areas);
    this.solicitudService.getEstado(1).subscribe(estado => this.estado = estado);
    this.flag_act = false;
    this.cargarSolicitud();
  }

  cargarSolicitud():void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        this.solicitudService.getSolicitud(id)
            .subscribe((solicitud) => {
              this.solicitud = solicitud;
              console.log('Cargar solicitud: ' + this.solicitud.id);
              this.flag_act = true;
              this.form.get('titulo').setValue(solicitud.titulo);
              this.form.get('destitulo').setValue(solicitud.desTitulo);
              this.form.get('imagen').setValue('cambiar imagen...');
              this.form.get('area').setValue(solicitud.area.id);

              console.log('Desde carga: ' + solicitud.titulo);
              console.log('Desde carga: ' + solicitud.imgsol);

              this.getImageFromService(solicitud.imgsol);

              /*const toSelect = solicitud.area.descrip;
              this.form.get('area').setValue(toSelect);*/
            });
        console.log('retorno');
      }
    })
  }

  obtenerEstado(id:number):void{
    this.solicitudService.getEstado(id).subscribe(estado => {
      console.log("-->" + estado.descrip);
      this.estado = estado;
    });
  }

  agregarSolicitud():void{
    //console.log(this.form);
    console.log('Agregar solicitud: ' + this.solicitud.id);
    this.idarea = this.form.value.area;
    this.solicitudService.getArea(this.idarea).subscribe((area) => {
      this.area_sel = area;

      this.solicitud.estadoSolic = this.estado;
      this.solicitud.titulo = this.form.value.titulo;
      this.solicitud.desTitulo = this.form.value.destitulo;
      this.solicitud.area = this.area_sel;
      this.solicitud.idcrea = this.idUser;
      console.log('antes de la accion: ' + this.solicitud.id);
      if(!this.solicitud.id) {
        this.solicitudService.create(this.solicitud).subscribe(
          solicitud => {
            this.router.navigate(['/dashboard']);
            if (this.form.value.imagen != "archivo..."){
              this.subirImagen(solicitud.id);
            }
            console.log(solicitud)
            //Envia correo al solicitante
            this.solicitudService.postEnviaCorreo(this.emailUser,'Notificación de DeltaNet',
              'Estimado(a) ' + this.authService.usuario.nombre +
              ' ' + this.authService.usuario.apellido + '\n' +
              'Has registrado satisfactoriamente el dia de hoy la siguiente solicitud:\n' +
              'ID: ' + solicitud.id + '\n' +
              'Titulo: ' + solicitud.titulo + '\n' +
              'Area: ' + solicitud.area.descrip ).subscribe();

            //Envia correo al jefe o responsable de area requerida
            this.usuarioService.getUsuario(solicitud.area.iduser).subscribe(data => {
              this.user_area = data;
              this.solicitudService.postEnviaCorreo(this.user_area.email,'Notificación de DeltaNet',
                 'Estimado(a) ' + data.nomper +
                 ' ' + data.apeper + '\n' +
                 'Ha sido registrado una solicitud para tu gestión. \n' +
                 'ID: ' + solicitud.id + '\n' +
                 'Titulo: ' + solicitud.titulo + '\n' +
                 'Enviada por: ' + this.authService.usuario.nombre + ' ' + this.authService.usuario.apellido).subscribe();
            });

            swal('Nueva Solicitud',`Solicitud creada con éxito..!..${solicitud.id}`,'info')
          }
        )
      }else{
        this.solicitudService.update(this.solicitud).subscribe(
          data => {
            this.router.navigate(['/dashboard']);
            if (this.form.value.imagen != "cambiar imagen..." &&
                this.form.value.imagen != "imagen cargada"){
              this.subirImagen(data.id);
            }
            //Envia correo al solicitante
            this.solicitudService.postEnviaCorreo(this.emailUser,'Notificación de DeltaNet',
              'Estimado(a) ' + this.authService.usuario.nombre +
              ' ' + this.authService.usuario.apellido + '\n' +
              'Has actualizado el dia de hoy la siguiente solicitud:\n' +
              'ID: ' + data.id + '\n' +
              'Titulo: ' + data.titulo + '\n' +
              'Area: ' + data.area.descrip ).subscribe();

              //Envia correo al jefe o responsable de area requerida
              this.usuarioService.getUsuario(data.area.iduser).subscribe(datauser => {
                this.user_area = datauser;
                this.solicitudService.postEnviaCorreo(this.user_area.email,'Notificación de DeltaNet',
                   'Estimado(a) ' + datauser.nomper +
                   ' ' + datauser.apeper + '\n' +
                   'Ha sido actualizado la solicitud para tu gestión. \n' +
                   'ID: ' + data.id + '\n' +
                   'Titulo: ' + data.titulo + '\n' +
                   'Enviada por: ' + this.authService.usuario.nombre + ' ' + this.authService.usuario.apellido).subscribe();
              });
              swal('Actualización Solicitud',`Solicitud actualizada con éxito..!..${data.id}`,'info')
          }
        );
      }
    });
  }

  uploadFileEvt(imgFile: any) {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.progreso = 0;
      this.fileImagen = imgFile.target.files[0];
      Array.from(imgFile.target.files).forEach((file: File) => {
        this.form.setValue({titulo: this.form.value.titulo,
          destitulo: this.form.value.destitulo,
          area: this.form.value.area,
          imagen: file.name});
      });

      let reader = new FileReader();
      reader.onload = (e: any) => {
        let image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          let imgBase64Path = e.target.result;
          console.log(rs);
          this.dataimage = imgBase64Path;
        };
      };
      reader.readAsDataURL(imgFile.target.files[0]);

      // Reset if duplicate image uploaded again
      this.fileInput.nativeElement.value = "";
    } else {
      this.form.value.imagen = 'Choose  File';
    }
  }

  subirImagen(id:number){
    this.solicitudService.subirFoto(this.fileImagen, id)
    .subscribe(event =>{
      if (event.type === HttpEventType.UploadProgress){
        this.progreso = Math.round(event.loaded/event.total*100);
      }
    })
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.dataimage = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImageFromService(file_imagen:string){
    if(file_imagen != null){
      this.form.get('imagen').setValue('imagen cargada');
      this.isImageLoading = true;
      this.solicitudService.getimage(file_imagen)
         .subscribe(data => {
           this.createImageFromBlob(data);
           this.isImageLoading = false;
         },error => {
           this.isImageLoading = false;
           console.log(error)
         })
    }
  }

}
