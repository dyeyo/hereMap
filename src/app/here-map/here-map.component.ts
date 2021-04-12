import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { RequestModel } from '../models/RequestModel';
import { LocationService } from '../services/location.service';
declare var H: any;

@Component({
  selector: 'app-here-map',
  templateUrl: './here-map.component.html',
  styleUrls: ['./here-map.component.css']
})
export class HereMapComponent implements OnInit {

  platform = new H.service.Platform({
    'apikey': 'YJkYaLYfjrJd0KcdECnSLhHaX86cnYTjOyUd9FqPAv4'
  });
  map: any
  targetElement = document.getElementById('mapContainer');
  defaultLayers = this.platform.createDefaultLayers();
  ui;
  group;
  marker;
  x;
  y;
  iconCamion = new H.map.Icon('./../assets/img/carritos-01.png');
  public start: any;
  waypoints = [];
  // waypoints = [];
  constructor(private locationService: LocationService) { }

  ngOnInit(): void {
    this.map = new H.Map(
      document.getElementById('mapContainer'),
      this.defaultLayers.vector.normal.map,
      {
        zoom: 15,
        // center: { lat: 1.214405018383404, lng: -77.27922019835766 }
        center: { lat: 4.58730, lng: -74.10725 }
      });
    window.addEventListener('resize', () => this.map.getViewPort().resize());
    let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, this.defaultLayers);
    this.addInfoBubble(this.map);
    this.getUbicacion()
    // const camiones = [];
    // this.waypoints.forEach(({ lat, lng }) => {
    //   let icon = new H.map.Icon('./../assets/img/carritos-01.png'),
    //     coords = { lat, lng },
    //     marker = new H.map.Marker(coords, { icon });
    //   camiones.push(icon);
    //   this.map.addObject(marker);
    // });
  }

  getUbicacion() {

  }

  // public moverCarro() {
  //   setInterval(() => {
  //     this.addMarkerToGroup(group, coordinate, html)
  //   }, 3000);
  // }

  public addMarkerToGroup(group, coordinate, html) {
    this.locationService.getLocations().subscribe((res: any) => {
      console.log(res);
      this.waypoints = res.results[0].waypoints;
      const camiones = [];
      // setInterval(() => {
      this.waypoints.forEach(({ lat, lng }) => {
        this.marker = new H.map.Marker(
          { lat, lng },
          { icon: this.iconCamion });
        camiones.push(this.marker);
        this.marker.setData(html);
        this.group.addObject(this.marker);
        this.map.addEventListener("tap", (e) => {
        });
      });
    })


    const reqModel = new RequestModel();
    reqModel.idusuario = 152;
    reqModel.estado = 'R';
    reqModel.Idempresa = 2;
    this.locationService.obtenerVehiculosZona(reqModel).subscribe((res: any) => {
      console.log(res);
      this.waypoints = res;
      const camiones = [];
      this.waypoints.forEach(({ latiudVehiculo, longitudVehiculo }) => {
        this.marker = new H.map.Marker(
          { latiudVehiculo, longitudVehiculo },
          { icon: this.iconCamion });
        camiones.push(this.marker);
        this.marker.setData(html);
        this.group.addObject(this.marker);
        this.map.addEventListener("tap", (e) => {
        });
      });
    })
  }
  addInfoBubble(map) {
    this.group = new H.map.Group();
    map.addObject(this.group);
    this.group.addEventListener('tap', (evt) => {
      let bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        content: evt.target.getData()
      });
      this.ui.addBubble(bubble);
    }, false);

    this.addMarkerToGroup(this.group, { lat: 1.2086258882443415, lng: -77.28358656039275 },
      '<div style="width: 12em;height: 9em;">' +
      '<p style="margin-left: 30px;">7</p>' +
      '<p style="font-size: 7px;margin-top: -20px;">entregas Completadas</p>' +
      '<p style="margin-top: -3.5em;margin-left: 8.5em;">7</p>' +
      '<p style="font-size: 7px;margin-top: -20px;margin-left: 13em;">entregas por hacer</p>' +
      '<p style="margin-top: -10px;margin-left: 4em;">ASD798</p>' +
      '<p style="margin-top: -10px;margin-left: 3em;s">Diego vallejo</p>' +
      '<a href="http://localhost:4200/" class="btn btnMap" style=" border-radius: 10px;margin-left: 16px;letter-spacing: 0px; color: #FFFFFF; opacity: 1; height: 2em; padding-top: 0.5em; margin-top: 9px; padding-bottom: 0.5em; text-align: center; padding-left: 2em; padding-right: 2em; background: transparent linear-gradient(89deg, #FC6100 0%, #FFB100 100%) 0% 0% no-repeat padding-box !important;">pedido en ruta</a>' +
      '</div>'
    );
  }
}
