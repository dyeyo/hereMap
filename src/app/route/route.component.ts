import { RequestModel } from './../models/RequestModel';
import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';

declare let H: any;
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
  icon2 = new H.map.Icon('./../assets/img/carritos-01.png');
  waypoints;
  listaEntregas: any = [];
  listaVeiculosRuta: any;

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
  }

  // public route(start: any, finish: any) {
  //   this.params =
  //   {
  //     "mode": "fastest;car",
  //     "waypoint0": "geo!" + this.start,
  //     "waypoint1": "geo!" + this.mitad,
  //     "waypoint2": "geo!" + this.prefin,
  //     "waypoint3": "geo!" + this.finish,
  //     "representation": "display"
  //   }
  //   this.map.removeObjects(this.map.getObjects());
  //   this.router.calculateRoute(this.params, data => {
  //     if (data.response) {
  //       this.directions = data.response.route[0].leg[0].maneuver;
  //       data = data.response.route[0];
  //       let lineString = new H.geo.LineString();
  //       data.shape.forEach(point => {
  //         let parts = point.split(",");
  //         lineString.pushLatLngAlt(parts[0], parts[1]);
  //       });
  //       let routeLine = new H.map.Polyline(lineString, {
  //         style: { strokeColor: "blue", lineWidth: 5 }
  //       })
  //       let startMarker = new H.map.Marker({
  //         lat: this.start.split(",")[0],
  //         lng: this.start.split(",")[1]
  //       }, { icon: this.icon2 });
  //       let medioMarker = new H.map.Marker({
  //         lat: this.mitad.split(",")[0],
  //         lng: this.mitad.split(",")[1]
  //       }, { icon: this.icon2 });
  //       let prefinishMarker = new H.map.Marker({
  //         lat: this.prefin.split(",")[0],
  //         lng: this.prefin.split(",")[1]
  //       }, { icon: this.icons });
  //       let finishMarker = new H.map.Marker({
  //         lat: this.finish.split(",")[0],
  //         lng: this.finish.split(",")[1]
  //       }, { icon: this.icons });
  //       this.map.addObjects([routeLine, startMarker, medioMarker, prefinishMarker, finishMarker]);
  //       this.map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
  //     }
  //   }, error => {
  //     console.error(error);
  //   });
  // }

  public routeOrig(start: any, finish: any) {

    const params = {
      "mode": "fastest;car",
      "representation": "display"
    }
    this.waypoints.forEach(({ lat, lng }, index) => {

      params[`waypoint${index}`] = `${lat},${lng}`
    });

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
        this.waypoints.forEach(({ lat, lng }) => {
          const camion = new H.map.Marker({ lat, lng }, { icon: this.icon2 });
          camiones.push(camion);
        });

        this.map.addObjects([routeLine, ...camiones]);
        this.map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
      }
    }, error => {
      console.error(error);
    });
  }

  public route(start: any, finish: any) {

    let params: any;

    if (this.listaVeiculosRuta[0].entregas.length > 1) {

      params =
      {
        "mode": "fastest;car",
        "representation": "display",
        "waypoint0": "geo!" + this.start,
        "waypoint1": "geo!" + this.finish,
      }

      this.listaVeiculosRuta[0].entregas.forEach(({ latitudestino, longituddestino }, index) => {
        const lat = latitudestino;
        const lng = longituddestino;
        params[`waypoint${index}`] = `${lat},${lng}`
      });
    } else if (this.listaVeiculosRuta[0].entregas.length === 1) {
      this.start = this.listaVeiculosRuta[0].latitudBodega + ',' + this.listaVeiculosRuta[1].longitudBodega;
      this.finish = this.listaVeiculosRuta[0].entregas[0].latitudestino + ',' + this.listaVeiculosRuta[0].entregas[0].longituddestino;
      params =
      {
        "mode": "fastest;car",
        "representation": "display",
        "waypoint0": "geo!" + this.start,
        "waypoint1": "geo!" + this.finish,
      }
    }

    if (this.listaVeiculosRuta[0].entregas.length > 0) {

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
          this.listaVeiculosRuta[0].entregas.forEach(({ latitudestino, longituddestino }) => {
            const lat = latitudestino;
            const lng = longituddestino;
            const camion = new H.map.Marker({ lat, lng }, { icon: this.icon2 });
            camiones.push(camion);
          });

          this.map.addObjects([routeLine, ...camiones]);
          this.map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
        }
      }, error => {
        console.error(error);
      });
    }
  }

  public addRouteShapeToMap(route) {
    route.sections.forEach((section) => {
      // decode LineString from the flexible polyline
      let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);

      // Create a polyline to display the route:
      let polyline = new H.map.Polyline(linestring, {
        style: {
          lineWidth: 4,
          strokeColor: 'rgba(0, 128, 255, 0.7)'
        }
      });

      // Add the polyline to the map
      this.map.addObject(polyline);
      // And zoom to its bounding rectangle
      this.map.getViewModel().setLookAtData({
        bounds: polyline.getBoundingBox()
      });
    });
  }

  public addMarkerToGroup(group, coordinate, html) {
    // this.locationService.getLocations().subscribe((res: any) => {
    //   console.log(res.results[0].waypoints);
    //   console.log('this.waypoints pre',this.waypoints);
    //   this.waypoints = res.results[0].waypoints;
    //   const camiones = [];
    //   debugger
    //   this.waypoints.forEach(({ lat, lng }) => {
    //     this.marker = new H.map.Marker(
    //       { lat, lng },
    //       { icon: this.icon2 });
    //     camiones.push(this.marker);
    //     this.marker.setData(html);
    //     this.group.addObject(this.marker);
    //     this.map.addEventListener("tap", (e) => {
    //     });
    //   });
    //   console.log('this.waypoints post',this.waypoints);
    // })
  }

  public addMarkerToGroupDos(group, coordinate, html) {

    this.locationService.GetToken().subscribe(tk => {
      const reqModel = new RequestModel();
      reqModel.idusuario = 152;
      reqModel.estado = 'R';
      reqModel.Idempresa = 2;
      this.locationService.obtenerVehiculosZona(reqModel, tk.token).subscribe(res => {
        console.log(res);
        console.log('this.waypoints pre', this.listaVeiculosRuta);
        this.listaVeiculosRuta = res;
        console.log('this.waypoints post', this.listaVeiculosRuta);
        const camiones = [];
        this.listaVeiculosRuta.forEach((ele) => {
          //debugger
          const lat = ele.latiudVehiculo;
          const lng = ele.longitudVehiculo;
          //this.listaEntregas.push(ele);

          this.marker = new H.map.Marker(
            { lat, lng },
            { icon: this.icon2 });
          camiones.push(this.marker);
          this.marker.setData(html);
          this.group.addObject(this.marker);
          this.map.addEventListener("tap", (e) => {
          });

        });
      })

    });

  }

  public addMarkerToGroupTres(group, coordinate, html) {

    this.locationService.GetToken().subscribe(tk => {
      const reqModel = new RequestModel();
      reqModel.idusuario = 152;
      reqModel.estado = 'R';
      reqModel.Idempresa = 2;
      console.log('this.waypoints pre2', this.waypoints);
      this.locationService.obtenerVehiculosZona(reqModel, tk.token).subscribe(res => {
        console.log('resApivehiculosRuta2', res);
        this.waypoints = res;
        console.log('this.waypoints post2', this.waypoints);
        const camiones = [];
        debugger
        this.waypoints.forEach(({ latiudVehiculo, longitudVehiculo }) => {
          const lat = latiudVehiculo;
          const lng = longitudVehiculo;
          if (longitudVehiculo === -74.11093000000001) {

          }
          else {
            this.marker = new H.map.Marker(
              { lat, lng },
              { icon: this.icon2 });
            console.log(this.marker);
            camiones.push(this.marker);
            console.log(camiones);
            console.log('this.waypoints post', this.waypoints);
            this.group.addObject(this.marker);
          }
        });
      })


    }, error => {

    });

  }
  login(login: any) {
    throw new Error('Method not implemented.');
  }

  clearMap() {
    this.routerActive.navigate(['ruta']);
  }

  // addMarkersToMap() {
  //   const reqModel = new RequestModel();
  //   reqModel.idusuario = 152;
  //   reqModel.estado = 'R';
  //   reqModel.Idempresa = 2;
  //   this.locationService.obtenerVehiculosZona(reqModel).subscribe(res => {
  //     this.waypoints = res;
  //     this.waypoints.forEach(({ latiudVehiculo, longitudVehiculo }) => {
  //       const camiones = [];
  //       this.marker = new H.map.Marker(
  //         { latiudVehiculo, longitudVehiculo },
  //         { icon: this.icon2 });
  //       console.log(this.marker);
  //       camiones.push(this.marker);
  //       console.log(camiones);
  //       this.group.addObject(this.marker);
  //     });
  //   })
  // }

  verRuta() {
    this.route(this.start, this.finish);
  }

  addInfoBubble(map) {
    this.map.addEventListener("tap", (e) => {
      // alert('asdsa')
      this.verRuta()
    });
    this.group = new H.map.Group();
    map.addObject(this.group);
    this.group.addEventListener('tap', (evt) => {
      let bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
        content: evt.target.getData()
      });
      this.ui.addBubble(bubble);
    }, false);

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

}

