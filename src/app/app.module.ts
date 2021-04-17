import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HereMapComponent } from './here-map/here-map.component';
import { FormsModule } from '@angular/forms';
import { RouteComponent } from './route/route.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RutasVehiculoComponent } from './rutas-vehiculo/rutas-vehiculo.component';
import { TitleCasePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    HereMapComponent,
    RouteComponent,
    RutasVehiculoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [TitleCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
