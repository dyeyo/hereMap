import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
declare var H: any;

@Component({
  selector: 'app-here-map',
  templateUrl: './here-map.component.html',
  styleUrls: ['./here-map.component.css']
})
export class HereMapComponent implements OnInit {

  platform = new H.service.Platform({
    'apikey': '23h0D8Ct5g8L-fXopb1Nh8Qt6YcJgOMMnRK93VTzERY'
  });
  map: any
  targetElement = document.getElementById('mapContainer');
  defaultLayers = this.platform.createDefaultLayers();
  ui;
  constructor() { }

  ngOnInit(): void {
    this.map = new H.Map(
      document.getElementById('mapContainer'),
      this.defaultLayers.vector.normal.map,
      {
        zoom: 15,
        center: { lat: 1.214405018383404, lng: -77.27922019835766 }
      });
    window.addEventListener('resize', () => this.map.getViewPort().resize());
    let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, this.defaultLayers);

    let icon = new H.map.Icon('./../assets/img/carritos-01.png'),
      coords = { lat: 1.2144085018383404, lng: -77.27922019835766 },
      marker = new H.map.Marker(coords, { icon });
    this.map.addObject(marker, marker);
  }

}
