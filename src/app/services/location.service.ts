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

  GetToken() {
    let login:any = {account: 'mitovar',password: 'Admin1980*',apikey: 'AAAA1bYTego:APA91bEvMz-bc0TroLp8W56q9uIJsuSvMzXlljBGLCqqr6em5q3Wk2eDdY6v79vR3D5rjHS8J-8fpGvUuDvjUssflfZ1wuNj-uSFdm8xAGN1BmIQpC_vXd5vXvCgIClS6YS4g3jYI6sTmtOVAR'}
    return this.http.post<any>('https://appqa.gipicorg.com/identity/api/Security/SignIn', login);
  }

  obtenerVehiculosZona(request: any,token: string) {
    const httpOptionsAuth = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+token
      })
    };
    return this.http.post<any>('https://appqa.gipicorg.com/tracking/api/Tracking/ObtenerVehiculosRuta', request, httpOptionsAuth);
  }

}
