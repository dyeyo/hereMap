import { LocationService } from './../services/location.service';
import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Input } from '@angular/core';

declare let H: any;
@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  title = 'here-project';
  public platform = new H.service.Platform({
    "apikey": "hwpesCIFlK4kf3OTS00AucCVEMuwSPZljuRvZtJVUdE"
  });

  @ViewChild("map")
  public mapElement: ElementRef;

  public appId: any;

  public appCode: any;

  public start: any;

  public mitad: any;

  public prefin: any;

  public finish: any;

  public width: any;

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
  html
  icons = new H.map.Icon('./../assets/img/marcadores-05.svg');
  iconCamion = new H.map.Icon('./../assets/img/carritos-01.png');
  waypoints = [
    {
      "id": "BOGOTAINICIO",
      "lat": 4.58728,
      "lng": -74.10724,
      "sequence": 0,
      "estimatedArrival": null,
      "estimatedDeparture": null
    },
    {
      "id": "Bogota2",
      "lat": 4.6031,
      "lng": -74.12812,
      "sequence": 1,
      "estimatedArrival": null,
      "estimatedDeparture": null
    },
    {
      "id": "PARQUENARIÑO",
      "lat": 1.21485,
      "lng": -77.27776,
      "sequence": 2,
      "estimatedArrival": null,
      "estimatedDeparture": null
    },
    {
      "id": "Catambuco",
      "lat": 1.166264,
      "lng": -77.299513,
      "sequence": 3,
      "estimatedArrival": null,
      "estimatedDeparture": null
    },
    {
      "id": "BARRANQUILLA",
      "lat": 10.96974,
      "lng": -74.80494,
      "sequence": 4,
      "estimatedArrival": null,
      "estimatedDeparture": null
    },
    {
      "id": "Bogota1",
      "lat": 4.61824,
      "lng": -74.11027,
      "sequence": 5,
      "estimatedArrival": null,
      "estimatedDeparture": null
    },
    {
      "id": "BOGOTAFIN",
      "lat": 4.58728,
      "lng": -74.10724,
      "sequence": 6,
      "estimatedArrival": null,
      "estimatedDeparture": null
    }
  ];

  defaultLayers = this.platform.createDefaultLayers();

  public constructor(private locationService: LocationService) {
    this.platform = new H.service.Platform({
      "apikey": "hwpesCIFlK4kf3OTS00AucCVEMuwSPZljuRvZtJVUdE"
    });

    this.directions = [];
    this.router = this.platform.getRoutingService();
  }

  public ngOnInit() {
    this.map = new H.Map(
      document.getElementById('mapContainer'),
      this.defaultLayers.vector.normal.map,
      {
        zoom: 15,
        center: { lat: 1.214405018383404, lng: -77.27922019835766 }
      });
    window.addEventListener('resize', () => this.map.getViewPort().resize());
    let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, this.defaultLayers)
    let icon = new H.map.Icon('./../assets/img/carritos-01.png'),
      coords = { lat: 1.2144085018383404, lng: -77.27922019835766 },
      marker = new H.map.Marker(coords, { icon })
    marker.addEventListener('tap', function (evt) {
      alert('HOLA');
    });
    this.map.addObject(marker, marker);
  }

  public ngAfterViewInit() {
    let defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(
      this.mapElement.nativeElement,
      defaultLayers.vector.normal.map,
      {
        zoom: 15,
        center: { lat: "4.58728", lng: "-74.10724" },
        pixelRatio: window.devicePixelRatio || 1
      }
    );
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    let icon = new H.map.Icon('./../assets/img/marcadores-05.svg'),
      coords = { lat: 1.2144085018383404, lng: -77.27922019835766 },
      marker = new H.map.Marker(coords, { icon });
    this.map.addObject(marker, marker);
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
    this.route(this.start, this.finish);
    this.addInfoBubble(this.map);
  }

  // getUbicacion() {
  //   this.locationService.getLocations().subscribe(res => {
  //     console.log(res);
  //     this.waypoints = res
  //   })
  // }

  public route(start: any, finish: any) {
    const params = {
      "mode": "fastest;car",
      "representation": "display"
    }
    this.waypoints.forEach(({ lat, lng }, index) => {

      params[`waypoint${index}`] = `${lat},${lng}`
    });
    // this.map.addEventListener('tap', function (evt) {
    //   console.log('HOLA');
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
        this.waypoints.forEach(({ lat, lng }) => {
          const camion = new H.map.Marker({ lat, lng }, { icon: this.iconCamion });
          camiones.push(camion);
        });

        this.map.addObjects([routeLine, ...camiones]);
        this.map.getViewModel().setLookAtData({ bounds: routeLine.getBoundingBox() });
      }
    }, error => {
      console.error(error);
    });
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
    this.marker = new H.map.Marker({
      lat: this.start.split(",")[0],
      lng: this.start.split(",")[1]
    }, { icon: this.iconCamion });
    // this.marker = new H.map.Marker(coordinate);
    this.marker.setData(html);
    this.group.addObject(this.marker);
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

