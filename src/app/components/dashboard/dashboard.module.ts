import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SolusersComponent } from './solusers/solusers.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TareasComponent } from './tareas/tareas.component';
import { SolareasComponent } from './solareas/solareas.component';
import { CrearSolicitudComponent } from './solusers/crear-solicitud/crear-solicitud.component';
import { AsignarSolicitudComponent } from './solareas/asignar-solicitud/asignar-solicitud.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SolusersComponent,
    NavbarComponent,
    TareasComponent,
    SolareasComponent,
    CrearSolicitudComponent,
    AsignarSolicitudComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
