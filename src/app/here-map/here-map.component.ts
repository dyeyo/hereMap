import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
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

  constructor() { }

  ngOnInit(): void {
    this.map = new H.Map(
      document.getElementById('mapContainer'),
      this.defaultLayers.vector.normal.map,
      {
        zoom: 15,
        center: { lat: 1.214405018383404, lng: -77.27922019835766 }
      });

    let icon = new H.map.Icon('./../assets/img/marcadores-05.svg'),
      coords = { lat: 1.2144085018383404, lng: -77.27922019835766 },
      marker = new H.map.Marker(coords, { icon });
    let icon2 = new H.map.Icon('./../assets/img/marcadores-05.svg'),
      coords2 = { lat: 1.2116539367839956, lng: -77.28388223378063 },
      marker2 = new H.map.Marker(coords, { icon2 });
    // Add the marker to the map and center the map at the location of the marker:
    this.map.addObject(marker, marker2);
    this.map.setCenter(coords, coords2);
  }

}
