import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HereMapComponent } from './here-map/here-map.component';
import { RouteComponent } from './route/route.component';

const routes: Routes = [
  { path: "", component: HereMapComponent },
  { path: "ruta", component: RouteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
