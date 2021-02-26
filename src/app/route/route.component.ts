import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, Input } from '@angular/core';

declare let H: any;

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.css']
})
export class RouteComponent implements OnInit {

  platform = new H.service.Platform({
    'apikey': 'YJkYaLYfjrJd0KcdECnSLhHaX86cnYTjOyUd9FqPAv4'
  });
  map: any
  defaultLayers;
  bubble;
  ui;
  // routeInstructionsContainer
  constructor() {
    this.calculateRouteFromAtoB(this.platform);
  }

  ngOnInit(): void {
    var mapContainer = document.getElementById('mapContainer'),
      routeInstructionsContainer = document.getElementById('panel');
    this.defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(mapContainer,
      this.defaultLayers.vector.normal.map,
      {
        center: { lat: 52.5160, lng: 13.3779 },
        zoom: 13,
        pixelRatio: window.devicePixelRatio || 1
      });
    window.addEventListener('resize', () => this.map.getViewPort().resize());
    let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    this.ui = H.ui.UI.createDefault(this.map, this.defaultLayers);

    this.calculateRouteFromAtoB(this.platform);
    this.onSuccess
    this.onError

  }

  calculateRouteFromAtoB(platform) {
    var router = platform.getRoutingService(null, 8),
      routeRequestParams = {
        routingMode: 'fast',
        transportMode: 'car',
        origin: '52.5160,13.3779', // Brandenburg Gate
        destination: '52.5206,13.3862',  // Friedrichstraße Railway Station
        return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
      };


    router.calculateRoute(
      routeRequestParams,
      this.onSuccess,
    );
  }

  onSuccess(result) {
    var route = result.routes[0];
    console.log(route);
    this.addRouteShapeToMap(route);
    this.addManueversToMap(route);
    this.addWaypointsToPanel(route);
    this.addManueversToPanel(route);
    this.addSummaryToPanel(route);
  }

  onError(error) {
    alert('Can\'t reach the remote server');
  }

  openBubble(position, text) {
    if (!this.bubble) {
      this.bubble = new H.ui.InfoBubble(
        position,
        // The FO property holds the province name.
        { content: text });
      this.ui.addBubble(this.bubble);
    } else {
      this.bubble.setPosition(position);
      this.bubble.setContent(text);
      this.bubble.open();
    }
  }

  addRouteShapeToMap(route) {
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

  addManueversToMap(route) {
    var svgMarkup = '<svg width="18" height="18" ' +
      'xmlns="http://www.w3.org/2000/svg">' +
      '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
      '</svg>',
      dotIcon = new H.map.Icon(svgMarkup, { anchor: { x: 8, y: 8 } }),
      group = new H.map.Group(),
      i,
      j;
    route.sections.forEach((section) => {
      let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();

      let actions = section.actions;
      // Add a marker for each maneuver
      for (i = 0; i < actions.length; i += 1) {
        let action = actions[i];
        var marker = new H.map.Marker({
          lat: poly[action.offset * 3],
          lng: poly[action.offset * 3 + 1]
        },
          { icon: dotIcon });
        marker.instruction = action.instruction;
        group.addObject(marker);
      }

      group.addEventListener('tap', (evt) => {
        this.map.setCenter(evt.target.getGeometry());
        this.openBubble(
          evt.target.getGeometry(), evt.target.instruction);
      }, false);

      // Add the maneuvers group to the map
      this.map.addObject(group);
    });
  }

  addWaypointsToPanel(route) {
    var mapContainer = document.getElementById('mapContainer'),
      routeInstructionsContainer = document.getElementById('panel');
    var nodeH3 = document.createElement('h3'),
      labels = [];

    route.sections.forEach((section) => {
      labels.push(
        section.turnByTurnActions[0].nextRoad.name[0].value)
      labels.push(
        section.turnByTurnActions[section.turnByTurnActions.length - 1].currentRoad.name[0].value)
    });

    nodeH3.textContent = labels.join(' - ');
    routeInstructionsContainer.innerHTML = '';
    routeInstructionsContainer.appendChild(nodeH3);
  }

  addSummaryToPanel(route) {
    let duration = 0,
      distance = 0;

    route.sections.forEach((section) => {
      distance += section.travelSummary.length;
      duration += section.travelSummary.duration;
    });

    var summaryDiv = document.createElement('div'),
      content = '';
    content += '<b>Total distance</b>: ' + distance + 'm. <br/>';
    content += '<b>Travel Time</b>: (in current traffic)';


    summaryDiv.style.fontSize = 'small';
    summaryDiv.style.marginLeft = '5%';
    summaryDiv.style.marginRight = '5%';
    summaryDiv.innerHTML = content;
    var mapContainer = document.getElementById('mapContainer'),
      routeInstructionsContainer = document.getElementById('panel');
    routeInstructionsContainer.appendChild(summaryDiv);
  }

  addManueversToPanel(route) {
    var nodeOL = document.createElement('ol');

    nodeOL.style.fontSize = 'small';
    nodeOL.style.marginLeft = '5%';
    nodeOL.style.marginRight = '5%';
    nodeOL.className = 'directions';

    route.sections.forEach((section) => {
      section.actions.forEach((action, idx) => {
        var li = document.createElement('li'),
          spanArrow = document.createElement('span'),
          spanInstruction = document.createElement('span');

        spanArrow.className = 'arrow ' + (action.direction || '') + action.action;
        spanInstruction.innerHTML = section.actions[idx].instruction;
        li.appendChild(spanArrow);
        li.appendChild(spanInstruction);

        nodeOL.appendChild(li);
      });
    });
    var mapContainer = document.getElementById('mapContainer'),
      routeInstructionsContainer = document.getElementById('panel');
    routeInstructionsContainer.appendChild(nodeOL);

  }
}
