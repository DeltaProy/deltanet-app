import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SolusersComponent } from './solusers/solusers.component'
import { SolareasComponent } from './solareas/solareas.component';
import { TareasComponent } from './tareas/tareas.component'
import { AuthGuard } from '../../usuarios/guards/auth.guard';

const routes: Routes = [
  { path: '', component: DashboardComponent, children: [
    {path: '', component: SolusersComponent},
    {path: 'solareas', component: SolareasComponent},
    {path: 'tareas', component: TareasComponent}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
