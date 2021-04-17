import { RequestModel } from './../models/RequestModel';
import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from '../services/location.service';
import { TitleCasePipe } from '@angular/common';

declare let H: any;

// function verRutas(log) {
//   alert('ruta'+log)
// }

@Component({
  selector: 'app-rutas-vehiculo',
  templateUrl: './rutas-vehiculo.component.html',
  styleUrls: ['./rutas-vehiculo.component.css']
})
export class RutasVehiculoComponent implements OnInit {

  title = 'here-project';
  private platform: any;

  @ViewChild("map")
  public mapElement: ElementRef;


  @Input()
  public start: any;

  @Input()
  public mitad: any;

  @Input()
  public prefin: any;

  @Input()
  public finish: any;


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
  html='<div style="width: 13em;height: 10em;">' +
  '<p style="margin-left: 30px;">{ENTREGAS_COMPLETADAS}</p>' +
  '<p style="font-size: 7px;margin-top: -20px;">entregas Completadas</p>' +
  `<p style="margin-top: -3.5em;margin-left: 8.5em;">{ENTREGAS_POR_HACER}</p>` +
  '<p style="font-size: 7px;margin-top: -20px;margin-left: 13em;">entregas por hacer</p>' +
  '<p style="margin-top: -10px;margin-left: 4em;">{PLACA}</p>' +
  '<p style="margin-top: -10px;margin-left: 3em;font-size: 12px;">{CONDUCTOR}</p>' +
  '<a id="btnVerRuta" onclick="alert({ID_RUTA})" class="btn btnMap" style=" border-radius: 10px;margin-left: 16px;letter-spacing: 0px; color: #FFFFFF; opacity: 1; height: 2em; padding-top: 0.5em; margin-top: 9px; padding-bottom: 0.5em; text-align: center; padding-left: 2em; padding-right: 2em; background: transparent linear-gradient(89deg, #FC6100 0%, #FFB100 100%) 0% 0% no-repeat padding-box !important;cursor:pointer;">pedido en ruta</a>' +
  '</div>'
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
  container: any;
  objetosMarker: any;
  objetosMarkerTemp: any;
  primerLlamadoAPIVehiculosRuta: number = 0;

  public constructor(private routerActive: Router, private locationService: LocationService,private titleCasePipe: TitleCasePipe) {
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
      //defaultLayers.vector.normal.map,
      defaultLayers.raster.normal.map,
      {
        zoom: 13,
        center: { lat: "1.2080690250186366", lng: "-77.2774602368257" },
        pixelRatio: window.devicePixelRatio || 1,
        engineType: H.map.render.RenderEngine.EngineType.P2D
      }
    );
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, defaultLayers);
    this. obtenerCarrosRuta();
    this.interval_time = setInterval(() => {
      // this.addInfoBubble();
      if(this.listaVeiculosRuta){
        this.agregarMarcadoresMapa();
        //alert('agrega marcadores')
      }else{
        //alert('llama Api')
      }
      this. obtenerCarrosRuta();

    }, 5000);

  }

  obtenerCarrosRuta(){


    console.log('this.primerLlamadoAPIVehiculosRuta',this.primerLlamadoAPIVehiculosRuta);
    //if(this.container) this.container.removeObjects(this.container.getObjects());

    this.locationService.GetToken().subscribe(tk => {
      const reqModel = new RequestModel();
      reqModel.idusuario = 152;
      reqModel.estado = 'R';
      reqModel.Idempresa = 2;
      let objetosMarker: any = [];
    //   if(this.container){
    //     this.container.removeObjects(this.container.getObjects());
    //   }else{
    //     console.log('falsocontainer');
    // }
      this.locationService.obtenerVehiculosZona(reqModel, tk.token).subscribe(res => {
        this.listaVeiculosRuta = res;
        const camiones = [];



        this.listaVeiculosRuta.forEach((ele) => {
          let entregasCompletadas = ele.entregas.length;
          let entregasPorHacer = 0;
          ele.entregas.forEach(ent => {
            //contar entregas por hacer
            //debugger;
            if (ent.estado === 'A' || ent.estado === 'S' || ent.estado === 'R') {
              entregasPorHacer++;
            }
          });

          entregasCompletadas = entregasCompletadas - entregasPorHacer;

          const lat = ele.latiudVehiculo;
          const lng = ele.longitudVehiculo;
          const nombreConductor = this.titleCasePipe.transform(ele.conductor);
          //this.idRuta = ele.idRuta;
          this.marker = new H.map.Marker(
            { lat, lng },
            { icon: this.icon2 });
            //console.log(ele)
            //Remplazar los datos en la plantilla HTML del globo de información
            let htmlTemporal = this.html;
            htmlTemporal = htmlTemporal.replace('{ENTREGAS_COMPLETADAS}',entregasCompletadas);
            htmlTemporal = htmlTemporal.replace('{ENTREGAS_POR_HACER}',entregasCompletadas);// pendiwnte variable error entregasPorHacer
            htmlTemporal = htmlTemporal.replace('{PLACA}',ele.placaVehiculo);
            htmlTemporal = htmlTemporal.replace('{CONDUCTOR}',nombreConductor);
            htmlTemporal = htmlTemporal.replace('{ID_RUTA}',ele.idRuta);
          this.marker.setData(ele.idRuta + '_' + htmlTemporal);
          camiones.push(this.marker);
          objetosMarker.push(this.marker);

        });


        this.objetosMarkerTemp = objetosMarker;

        if(this.primerLlamadoAPIVehiculosRuta==0){
          this.agregarMarcadoresMapa()
          console.log('.primerLlamadoAPIVehiculosRuta = 0');

        }
        this.primerLlamadoAPIVehiculosRuta=1;

      })
    });
  }

  agregarMarcadoresMapa(){
   //Borrar los marcadores carritos (container) anteriores para evitar duplicarlos por el intervalo
   //cunado un carro cambia de posición
    if(this.container) this.container.removeObjects(this.container.getObjects());

    this.group = new H.map.Group();

    this.container = new H.map.Group({
      objects: [...this.objetosMarkerTemp]
    });

    this.container.addEventListener('tap', event => {
      this.verRuta(event.target.getData());
      let htmlBubble = event.target.getData();
      let bubble = new H.ui.InfoBubble(event.target.getGeometry(), {
        content: htmlBubble.split('_')[1]
      });
      this.ui.addBubble(bubble);
    });


    this.group.addObject(this.container);

    console.log('this.group.',this.group)
    console.log('container',this.container.getObjects())

     this.map.addObject(this.group);
  }

  verRuta(e) {
    const ruta = this.listaVeiculosRuta.find(r => r.idRuta === +e.split('_')[0]);
    console.log('ruta:',ruta.idRuta,'-',ruta.entregas);
    // if (!this.listaVeiculosRuta) {
    //   alert("No hay entregas")
    // }
    this.waypoints = [];
    this.waypoints.push(ruta.entregas)

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
      "representation": "display",
      "waypoint0": start,
    }

    // const paramsAlternative = {
    //   "mode": "fastest;car",
    //   "representation": "display"
    // }

    this.waypoints[0].forEach(({ latitudestino, longituddestino }, index) => {
      params[`waypoint${index+1}`] = `${latitudestino},${longituddestino}`
    });

    // this.waypointsAlternative.forEach(({ latitud, longitud }, index) => {
    //   paramsAlternative[`waypoint${index}`] = `${latitud},${longitud}`
    // });

    if(this.container) this.container.removeObjects(this.container.getObjects());
    this.map.removeObjects(this.map.getObjects());

    if(this.container){
      this.container = new H.map.Group({
        objects: [...this.objetosMarkerTemp]
      });

      this.container.addEventListener('tap', event => {
        this.verRuta(event.target.getData());
        let htmlBubble = event.target.getData();
        let bubble = new H.ui.InfoBubble(event.target.getGeometry(), {
          content: htmlBubble.split('_')[1]
        });
        this.ui.addBubble(bubble);
      });

    }else{
      console.log('falsocontainer');
    }
    this.group.addObject(this.container);
    this.map.addObject(this.group);

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
  }


  clearMap() {
    this.map.removeObjects(this.map.getObjects());
    this.waypoints = []
    }

}



