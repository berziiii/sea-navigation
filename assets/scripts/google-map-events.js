'use strict';

let MAP;
let GOOGLE;
let addCoord = false;
let pointBreadcrumbTemplate = require('../views/partials/pointsBreadcrumb.hbs');
/**
 * @constructor
 */

let coordinatesArray = [];
let markersArray = [];
let navPathArray = [];

let ClickEventHandler = function(google, map, origin) {
  this.origin = origin;
  this.map = map;
  MAP = map;
  GOOGLE = google;
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

let formatTotalDistance = function(totalDistance) {
  // Converts Total Distance from Kilometers into Miles
  let Miles = (totalDistance * .621371).toFixed(2);
  // Converts Total Distance from Miles into Nautical Miles
  // let NauticalMiles = (Miles * 0.868976).toFixed(2);
  return Miles;
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
  navPathArray.push(navPlot);
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
  // let nauticalMiles = formatTotalDistance(totalDistance);
  let miles = formatTotalDistance(totalDistance);
  $('#totalDistance').html('');
  // $('#totalDistance').html('<h5> Total Distance: '+nauticalMiles+' Nautical Miles</h5>');
  $('#totalDistance').html('<h5> Total Distance: '+miles+' Miles</h5>');
};

let drawMarker = function(coords) {
  let marker = new GOOGLE.maps.Marker({
    map: MAP,
    animation: GOOGLE.maps.Animation.DROP,
    position: {lat: coords.lat, lng: coords.lng},
    title: coords.title,
  });
  markersArray.push(marker);
  for (let i=0; i<navPathArray.length; i++) {
    navPathArray[i].setMap(null);
  }
  navPathArray = [];
  if (coordinatesArray.length > 1) {
    drawNavPlot(marker);
  }
  addCoord = false;
  MAP.setOptions({draggableCursor:''});
};

let removePointFromList = function() {
  $('.glyphicon-trash').on('click', function() {
    let index = $(this).data('id');
    while(markersArray.length) { markersArray.pop().setMap(null); }
    if (coordinatesArray.length > 1) {
      coordinatesArray.splice(index, 1);
      for (let i=0;i<coordinatesArray.length;i++) {
        let coord = coordinatesArray[i];
        let number = (i + 1);
        coord.title = `Point ${number}`;
        drawMarker(coord);
        addPointBreadcrumb();
      }
      if (coordinatesArray.length === 1) {
        $('#totalDistance').html('');
      }
    } else {
      coordinatesArray = [];
      markersArray = [];
      navPathArray = [];
      $('#coords-list').html('');
    }
  });
};

let addPointBreadcrumb = function() {
  $('#coords-list').html(' ');
  $('#coords-list').html(pointBreadcrumbTemplate({coordinates: coordinatesArray}));
  removePointFromList();
};

let getClickCoordinates = function(coords) {
  if (addCoord) {
    let number  = (coordinatesArray.length + 1);
    coords.title = `Point ${number}`;
    coordinatesArray.push(coords);
    drawMarker(coords);
    addPointBreadcrumb();
  }
};

let addPointEventHandler = function() {
  $('.add-coord-button').on('click', function() {
    addCoord = true;
    MAP.setOptions({draggableCursor:'crosshair'});
  });
};

ClickEventHandler.prototype.handleClick = function(event) {
  // If the event has a placeId, use it.
  if (event.placeId) {
    getPlaceInformation(event.placeId);
  } else {
    let coords = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    }
    getClickCoordinates(coords);
  }
};


module.exports = {
  ClickEventHandler,
  getClickCoordinates,
  addPointEventHandler,
};
