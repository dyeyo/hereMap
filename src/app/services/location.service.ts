import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  getLocations() {
    return this.http.get('https://wse.ls.hereapi.com/2/findsequence.json?start=BOGOTAINICIO;4.58728,-74.10724&de[…]ta1;4.61824,-74.11027&destination5=Bogota2;4.6031,-74.12812');
  }
}
