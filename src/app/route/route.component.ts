import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';

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
  public constructor(private routerActive: Router) {
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
        // center: { lat: "4.58728", lng: "-74.10724" },
        pixelRatio: window.devicePixelRatio || 1
      }
    );
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
    this.addInfoBubble(this.map);
    this.addMarkersToMap();
  }

  public route(start: any, finish: any) {
    this.params =
    {
      "mode": "fastest;car",
      "waypoint0": "geo!" + this.start,
      "waypoint1": "geo!" + this.mitad,
      "waypoint2": "geo!" + this.prefin,
      "waypoint3": "geo!" + this.finish,
      "representation": "display"
    }
    this.map.removeObjects(this.map.getObjects());
    this.router.calculateRoute(this.params, data => {
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
        let startMarker = new H.map.Marker({
          lat: this.start.split(",")[0],
          lng: this.start.split(",")[1]
        }, { icon: this.icon2 });
        let medioMarker = new H.map.Marker({
          lat: this.mitad.split(",")[0],
          lng: this.mitad.split(",")[1]
        }, { icon: this.icon2 });
        let prefinishMarker = new H.map.Marker({
          lat: this.prefin.split(",")[0],
          lng: this.prefin.split(",")[1]
        }, { icon: this.icons });
        let finishMarker = new H.map.Marker({
          lat: this.finish.split(",")[0],
          lng: this.finish.split(",")[1]
        }, { icon: this.icons });
        this.map.addObjects([routeLine, startMarker, medioMarker, prefinishMarker, finishMarker]);
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
    }, { icon: this.icon2 });
    // this.marker = new H.map.Marker(coordinate);
    this.marker.setData(html);
    this.group.addObject(this.marker);
  }

  clearMap() {
    alert('lala')
    this.routerActive.navigate(['ruta']);
  }

  addMarkersToMap() {
    var parisMarker = new H.map.Marker({ lat: 1.2086258882443415, lng: -77.28358656039275 },
      { icon: this.icon2 });
    this.map.addObject(parisMarker);
    this.map.addEventListener("tap", (e) => {
      this.verRuta()
    });
  }

  verRuta() {
    this.route(this.start, this.finish);
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
      `<p style="margin-top: -3.5em;margin-left: 8.5em;">7</p>` +
      '<p style="font-size: 7px;margin-top: -20px;margin-left: 13em;">entregas por hacer</p>' +
      '<p style="margin-top: -10px;margin-left: 4em;">ASD798</p>' +
      '<p style="margin-top: -10px;margin-left: 3em;s">Diego vallejo</p>' +
      '<a (click)="alerta()" class="btn btnMap" style=" border-radius: 10px;margin-left: 16px;letter-spacing: 0px; color: #FFFFFF; opacity: 1; height: 2em; padding-top: 0.5em; margin-top: 9px; padding-bottom: 0.5em; text-align: center; padding-left: 2em; padding-right: 2em; background: transparent linear-gradient(89deg, #FC6100 0%, #FFB100 100%) 0% 0% no-repeat padding-box !important;">pedido en ruta</a>' +
      '</div>'
    );
  }

}
