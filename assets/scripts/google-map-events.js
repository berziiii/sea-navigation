'use strict';

let MAP;
let GOOGLE;
/**
 * @constructor
 */

let coordinatesArray = [];

let ClickEventHandler = function(google, map, origin) {
  this.origin = origin;
  this.map = map;
  MAP = map;
  GOOGLE = google;
  // this.directionsService = new google.maps.DirectionsService;
  // this.directionsDisplay = new google.maps.DirectionsRenderer;
  // this.directionsDisplay.setMap(map);
  this.placesService = new google.maps.places.PlacesService(map);
  this.infowindow = new google.maps.InfoWindow;
  this.infowindowContent = document.getElementById('infowindow-content');
  this.infowindow.setContent(this.infowindowContent);

  // Listen for clicks on the map.
  this.map.addListener('click', this.handleClick.bind(this));
};

let getPlaceInformation = function(placeId) {
  let me = this;
  this.placesService.getDetails({placeId: placeId}, function(place, status) {
    if (status === 'OK') {
      me.infowindow.close();
      me.infowindow.setPosition(place.geometry.location);
      me.infowindowContent.children['place-icon'].src = place.icon;
      me.infowindowContent.children['place-name'].textContent = place.name;
      me.infowindowContent.children['place-id'].textContent = place.place_id;
      me.infowindowContent.children['place-address'].textContent =
          place.formatted_address;
      me.infowindow.open(me.map);
    }
  });
};

let drawNavPlot = function() {
  let totalDistance = 0;
  let navPlot = new GOOGLE.maps.Polyline({
    path: coordinatesArray,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
  navPlot.setMap(MAP);
  for (let i=0; i<coordinatesArray.length;i++) {
    let coord = coordinatesArray[i];
    if (i === (coordinatesArray.length - 1)) {
      break;
    } else {
      let distance = (GOOGLE.maps.geometry.spherical.computeDistanceBetween(new GOOGLE.maps.LatLng(coord.lat, coord.lng), new GOOGLE.maps.LatLng(coordinatesArray[i+1].lat, coordinatesArray[+1].lng))/1000);
      totalDistance+=distance;
    }
  }
  totalDistance = (totalDistance * .621371).toFixed(2);
  console.log(totalDistance);
};

let drawMarker = function(coords) {
  let marker = new GOOGLE.maps.Marker({
    map: MAP,
    draggable: true,
    animation: GOOGLE.maps.Animation.DROP,
    position: coords,
    title: 'COORD'
  });
  if (coordinatesArray.length > 1) {
    drawNavPlot();
  }
};

let getClickCoordinates = function(coords) {
    coordinatesArray.push(coords);
    drawMarker(coords);
  // let coords = {
  //   lat: event.latLng.lat(),
  //   long: event.latLng.lng(),
  // };
  // console.log(coords);
  // this.directionsService.route({
  //   origin: this.origin,
  //   destination: {placeId: placeId},
  //   travelMode: 'WALKING'
  // }, function(response, status) {
  //   if (status === 'OK') {
  //     me.directionsDisplay.setDirections(response);
  //   } else {
  //     window.alert('Directions request failed due to ' + status);
  //   }
  // });
};

ClickEventHandler.prototype.handleClick = function(event) {
  // If the event has a placeId, use it.
  if (event.placeId) {

    // Calling e.stop() on the event prevents the default info window from
    // showing.
    // If you call stop here when there is no placeId you will prevent some
    // other map click event handlers from receiving the event.
    // event.stop();
    // this.calculateAndDisplayRoute(event.placeId);
    getPlaceInformation(event.placeId);
  } else {
    let coords = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    getClickCoordinates(coords);
  }
};

// ClickEventHandler.prototype.calculateAndDisplayRoute = function(placeId) {
//   let me = this;
//   this.directionsService.route({
//     origin: this.origin,
//     destination: {placeId: placeId},
//     travelMode: 'WALKING'
//   }, function(response, status) {
//     if (status === 'OK') {
//       me.directionsDisplay.setDirections(response);
//     } else {
//       window.alert('Directions request failed due to ' + status);
//     }
//   });
// };


module.exports = {
  ClickEventHandler,
  getClickCoordinates,
};
