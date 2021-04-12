import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getLocations() {
    return this.http.get('https://wse.ls.hereapi.com/2/findsequence.json?start=BOGOTAINICIO;4.58728,-74.10724&destination1=PARQUENARI%C3%91O;1.21485,-77.27776&destination2=BARRANQUILLA;10.96974,-74.80494&end=BARRANQUILLAFIN;10.96974,-74.80494&mode=fastest;car&apiKey=drks5IgGHgi1I9DiBRWeOMnqnylqZIf7heEwiNoSJqI&destination3=Catambuco;1.166264,-77.299513&destination4=Bogota1;4.61824,-74.11027&destination5=Bogota2;4.6031,-74.12812');
  }

  obtenerVehiculosZona(request: any) {
    const httpOptionsAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MTgyNjkxODYsImlzcyI6ImNvcmcuY29tIiwiYXVkIjoiY29yZy5jb20ifQ.JI8y_Ohe140MwnlEvTVVPE6rHdpGHSJvy4GxtmGx8Mw'
      })
    };
    return this.http.post<any>('https://appdev.gipicorg.com:8438/api/Tracking/ObtenerVehiculosRuta', request, httpOptionsAuth);
  }

}
