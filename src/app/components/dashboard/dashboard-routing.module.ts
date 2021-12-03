import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SolusersComponent } from './solusers/solusers.component'
import { SolareasComponent } from './solareas/solareas.component';
import { TareasComponent } from './tareas/tareas.component'
import { AuthGuard } from '../../usuarios/guards/auth.guard';
//import { RoleGuard } from '../../usuarios/guards/role.guard';
import { CrearSolicitudComponent } from './solusers/crear-solicitud/crear-solicitud.component'
import { UsersComponent } from './users/users.component';
import { CrearUsuarioComponent } from './users/crear-usuario/crear-usuario.component';
import { CambioContraComponent } from './users/cambio-contra/cambio-contra.component';

const routes: Routes = [
  { path: '', component: DashboardComponent, children: [
    {path: '', component: SolusersComponent},
    {path: 'solareas', component: SolareasComponent},
    {path: 'tareas', component: TareasComponent},
    {path: 'crear-solicitud', component: CrearSolicitudComponent, canActivate:[AuthGuard]},
    {path: 'crear-solicitud/:id', component: CrearSolicitudComponent, canActivate:[AuthGuard]},
    {path: 'users', component: UsersComponent, canActivate:[AuthGuard]},
    {path: 'users/crear-usuario', component: CrearUsuarioComponent, canActivate:[AuthGuard]},
    {path: 'users/crear-usuario/:id', component: CrearUsuarioComponent, canActivate:[AuthGuard]},
    {path: 'users/cambio-contra/:id', component: CambioContraComponent, canActivate:[AuthGuard]}
    
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
