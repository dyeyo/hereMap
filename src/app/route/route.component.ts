import { RequestModel } from './../models/RequestModel';
import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';

declare let H: any;

// function verRutas(log) {
//   alert('ruta'+log)
// }

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  title = 'here-project';
  private platform: any;

  @ViewChild("map")
  public mapElement: ElementRef;

  @Input()
  public appId: any;

  @Input()
  public appCode: any;

  @Input()
  public start: any;

  @Input()
  public mitad: any;

  @Input()
  public prefin: any;

  @Input()
  public finish: any;

  @Input()
  public width: any;

  @Input()
  public height: any;

  public directions: any;

  private map: any;
  private router: any;
  ui;
  openBubble
  routingMode
  marker
  group
  coordinate
  params
  html
  icons = new H.map.Icon('./../assets/img/marcadores-05.svg');
  icon2 = new H.map.Icon('./../assets/img/carritos-01.svg');
  icon3 = new H.map.Icon('./../assets/img/marcadores-05.svg');
  listaEntregas: any = [];
  listaVeiculosRuta: any;
  idEntrega
  idRuta
  entregaList
  waypoints = [];
  waypointsAlternative = [];
  interval_time

  public constructor(private routerActive: Router, private locationService: LocationService) {
    this.platform = new H.service.Platform({
      "apikey": "YJkYaLYfjrJd0KcdECnSLhHaX86cnYTjOyUd9FqPAv4"
    });
    this.routingMode = 'fast';
    this.start = "1.2086258882443415,-77.28358656039275";
    this.mitad = "1.217051,-77.283424";
    this.prefin = "1.224967,-77.291535";
    this.finish = "1.2068161609787038,-77.27432740193775";
    this.directions = [];
    this.router = this.platform.getRoutingService();
  }

  public ngOnInit() { }

  public ngAfterViewInit() {
    let defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(
      this.mapElement.nativeElement,
      defaultLayers.vector.normal.map,
      {
        zoom: 15,
        center: { lat: "1.2080690250186366", lng: "-77.2774602368257" },
        pixelRatio: window.devicePixelRatio || 1
      }
    );
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
    this.addInfoBubble(this.map);
    this.interval_time = setInterval(() => {
      this.addInfoBubble(this.map);
    }, 1000);

  }

  public addRouteShapeToMap(route) {
    route.sections.forEach((section) => {
      let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

      let polyline = new H.map.Polyline(linestring, {
        style: {
          lineWidth: 4,
          strokeColor: 'rgba(0, 128, 255, 0.7)'
        }
      });

      this.map.addObject(polyline);

      this.map.getViewModel().setLookAtData({
        bounds: polyline.getBoundingBox()
      });

    });
  }

  public addMarkerToGroupDos(group, coordinate, html) {
    this.locationService.GetToken().subscribe(tk => {
      const reqModel = new RequestModel();
      reqModel.idusuario = 152;
      reqModel.estado = 'R';
      reqModel.Idempresa = 2;
      let objetosMarker: any = [];
      this.locationService.obtenerVehiculosZona(reqModel, tk.token).subscribe(res => {
        this.listaVeiculosRuta = res;

        const camiones = [];

        this.listaVeiculosRuta.forEach((ele) => {
          const lat = ele.latiudVehiculo;
          const lng = ele.longitudVehiculo;
          this.idRuta = ele.idRuta;
          this.marker = new H.map.Marker(
            { lat, lng },
            { icon: this.icon2 });
          this.marker.setData(ele.idRuta);
          camiones.push(this.marker);
          objetosMarker.push(this.marker);
        });

        var container = new H.map.Group({
          objects: [...objetosMarker]
        });

        container.addEventListener('tap', event => {
          this.verRuta(event.target.getData());
        });

        this.group.addObject(container);
      })
    });

  }

  verRuta(e) {
    this.listaVeiculosRuta = this.listaVeiculosRuta.find(r => r.idRuta === e);
    // if (!this.listaVeiculosRuta) {
    //   alert("No hay entregas")
    // }

    this.waypoints.push(this.listaVeiculosRuta.entregas)

    // this.waypoints[0].forEach((item, index) => {

    //   if (item.posicionamiento.length != 0) {
    //     this.waypointsAlternative.push(item.posicionamiento[index])
    //     this.waypointsAlternative.filter(el => el != undefined)
    //   }
    // });
    // console.log('FINAL', this.waypointsAlternative);
    this.route(this.start, this.finish);
  }

  public route(start: any, finish: any) {

    const params = {
      "mode": "fastest;car",
      "representation": "display"
    }

    // const paramsAlternative = {
    //   "mode": "fastest;car",
    //   "representation": "display"
    // }

    this.waypoints[0].forEach(({ latitudestino, longituddestino }, index) => {
      params[`waypoint${index}`] = `${latitudestino},${longituddestino}`
    });

    // this.waypointsAlternative.forEach(({ latitud, longitud }, index) => {
    //   paramsAlternative[`waypoint${index}`] = `${latitud},${longitud}`
    // });

    this.map.removeObjects(this.map.getObjects());

    this.router.calculateRoute(params, data => {
      if (data.response) {
        this.directions = data.response.route[0].leg[0].maneuver;
        data = data.response.route[0];
        let lineString = new H.geo.LineString();
        data.shape.forEach(point => {
          let parts = point.split(",");
          lineString.pushLatLngAlt(parts[0], parts[1]);
        });
        let routeLine = new H.map.Polyline(lineString, {
          style: { strokeColor: "blue", lineWidth: 5 }
        })

        const camiones = [];
        this.waypoints[0].forEach(({ latitudestino, longituddestino }) => {
          const camion = new H.map.Marker({ lat: latitudestino, lng: longituddestino }, { icon: this.icon3 });
          camiones.push(camion);
        });

        this.map.addObjects([routeLine, ...camiones]);
        this.map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
      }
    }, error => {
      console.error(error);
    });

    //ALTERNATIVATE

    /*this.router.calculateRoute(paramsAlternative, data => {
      if (data.response) {
        this.directions = data.response.route[0].leg[0].maneuver;
        data = data.response.route[0];
        let lineString = new H.geo.LineString();

        data.shape.forEach(point => {
          let parts = point.split(",");
          lineString.pushLatLngAlt(parts[0], parts[1]);
        });

        let routeLine = new H.map.Polyline(lineString, {
          style: { strokeColor: "blue", lineWidth: 5 }
        })

        const camiones = [];
        this.waypointsAlternative.forEach(({ latitud, longitud }) => {
          const camion = new H.map.Marker({ lat: latitud, lng: longitud }, { icon: this.icon3 });
          camiones.push(camion);
        });

        this.map.addObjects([routeLine, ...camiones]);
        this.map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
      }
    }, error => {
      console.error(error);
    });*/
  }

  addInfoBubble(map) {
    // this.map.addEventListener("tap", (e) => {
    //   // alert('asdsa')
    //   this.verRuta()
    // });

    this.group = new H.map.Group();
    map.addObject(this.group);
    // this.group.addEventListener('tap', (evt) => {
    //   let bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
    //     content: evt.target.getData()
    //   });
    //   this.ui.addBubble(bubble);
    // }, false);

    // this.addMarkerToGroup(this.group, { lat: 1.2086258882443415, lng: -77.28358656039275 },
    //   '<div style="width: 12em;height: 9em;">' +
    //   '<p style="margin-left: 30px;">7</p>' +
    //   '<p style="font-size: 7px;margin-top: -20px;">entregas Completadas</p>' +
    //   `<p style="margin-top: -3.5em;margin-left: 8.5em;">7</p>` +
    //   '<p style="font-size: 7px;margin-top: -20px;margin-left: 13em;">entregas por hacer</p>' +
    //   '<p style="margin-top: -10px;margin-left: 4em;">ASD798</p>' +
    //   '<p style="margin-top: -10px;margin-left: 3em;s">Diego vallejo</p>' +
    //   '<a (click)="alerta()" class="btn btnMap" style=" border-radius: 10px;margin-left: 16px;letter-spacing: 0px; color: #FFFFFF; opacity: 1; height: 2em; padding-top: 0.5em; margin-top: 9px; padding-bottom: 0.5em; text-align: center; padding-left: 2em; padding-right: 2em; background: transparent linear-gradient(89deg, #FC6100 0%, #FFB100 100%) 0% 0% no-repeat padding-box !important;">pedido en ruta</a>' +
    //   '</div>'
    // );

    this.addMarkerToGroupDos(this.group, { lat: 1.2086258882443415, lng: -77.28358656039275 },
      '<div style="width: 12em;height: 9em;">' +
      '<p style="margin-left: 30px;">7</p>' +
      '<p style="font-size: 7px;margin-top: -20px;">entregas Completadas</p>' +
      `<p style="margin-top: -3.5em;margin-left: 8.5em;">7</p>` +
      '<p style="font-size: 7px;margin-top: -20px;margin-left: 13em;">entregas por hacer</p>' +
      '<p style="margin-top: -10px;margin-left: 4em;">ASD798</p>' +
      '<p style="margin-top: -10px;margin-left: 3em;s">Diego vallejo</p>' +
      '<a (click)="alerta()" class="btn btnMap" style=" border-radius: 10px;margin-left: 16px;letter-spacing: 0px; color: #FFFFFF; opacity: 1; height: 2em; padding-top: 0.5em; margin-top: 9px; padding-bottom: 0.5em; text-align: center; padding-left: 2em; padding-right: 2em; background: transparent linear-gradient(89deg, #FC6100 0%, #FFB100 100%) 0% 0% no-repeat padding-box !important;">pedido en ruta</a>' +
      '</div>'
    );
  }

  clearMap() {
    this.map.removeObjects(this.map.getObjects());
    this.waypoints = []
    this.addInfoBubble(this.map);
  }

}


