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
import { UsersComponent } from './users/users.component';
import { CrearUsuarioComponent } from './users/crear-usuario/crear-usuario.component';
import { CambioContraComponent } from './users/cambio-contra/cambio-contra.component';


@NgModule({
  declarations: [
    DashboardComponent,
    SolusersComponent,
    NavbarComponent,
    TareasComponent,
    SolareasComponent,
    CrearSolicitudComponent,
    UsersComponent,
    CrearUsuarioComponent,
    CambioContraComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
