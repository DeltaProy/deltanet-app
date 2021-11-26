import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
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
  estado: ListEstado;
  area_sel: Area;
  form: FormGroup;
  fileAttr = 'cambia File';
  private fileImagen:File;
  dataimage: any;
  progreso: number = 0;
  idarea:number;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(private solicitudService: SolicitudService,
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
    this.solicitudService.getAreas().subscribe(areas => this.areas = areas);
    this.solicitudService.getEstado(1).subscribe(estado => this.estado = estado);
    this.cargarSolicitud();
  }

  cargarSolicitud():void{
    console.log('Cargar Solicitud');
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      console.log('id..:' + id);
      if(id){
        this.solicitudService.getSolicitud(id)
            .subscribe((solicitud) => {
              this.solicitud = solicitud;
              console.log('Actrualiza..: ' + solicitud.area.id);
              console.log('Actrualiza....: ' + solicitud.area.descrip);
              this.form.get('titulo').setValue(solicitud.titulo);
              this.form.get('destitulo').setValue(solicitud.desTitulo);
              this.form.get('imagen').setValue('cambiar imagen...');
              this.form.get('area').setValue(solicitud.area.id);

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
    console.log('Agregar solicitud');
    console.log(this.form.value.area);
    this.idarea = this.form.value.area;
    this.solicitudService.getArea(this.idarea).subscribe((area) => {
      this.area_sel = area;
      console.log(area.id);
      this.solicitud.estadoSolic = this.estado;
      this.solicitud.titulo = this.form.value.titulo;
      this.solicitud.desTitulo = this.form.value.destitulo;
      this.solicitud.area = this.area_sel;
      this.solicitud.idcrea = 1;
      this.solicitudService.create(this.solicitud).subscribe(
        solicitud => {
          this.router.navigate(['/dashboard']);
          console.log('imagen');
          console.log(this.form.value.imagen);
          if (this.form.value.imagen != "archivo..."){
            console.log('si');
            this.subirImagen(solicitud.id);
          }
          swal('Nueva Solicitud',`Solicitud creada con éxito..!..${solicitud.id}`,'info')
        }
      );
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
    console.log('Subire foto...' || id);
    this.solicitudService.subirFoto(this.fileImagen, id)
    .subscribe(event =>{
      if (event.type === HttpEventType.UploadProgress){
        this.progreso = Math.round(event.loaded/event.total*100);
      }
    })
  }

}
