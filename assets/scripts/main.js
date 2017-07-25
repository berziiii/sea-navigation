'use strict';

let env               = require('../../env.js');
let GoogleMapsLoader  = require('google-maps');
let mapStyles         =  require('./google-map-styles');
let mapEvents         = require('./google-map-events');
let map;
GoogleMapsLoader.KEY = env.GOOGLE_MAPS_API_KEY;
GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];


let setStyles = function() {
  // Get style for map theme
  let style = mapStyles.retro;
  return style;
};

let removeLoaderScreen = function() {
  $('#loading').addClass('fadeOut');
  setTimeout(function() {
    $('#loading').addClass('displayNone');
  }, 2000);
};

let initMap = function(crds) {
  let origin = {lat: crds.lat, lng: crds.lng};
  GoogleMapsLoader.load(function(google) {
    map = new google.maps.Map(document.getElementById('map-container'), {
      center: origin,
      zoom: 12,
      mapTypeId: 'roadmap'
    });
    // Sets map Style to Retro
    map.setOptions({styles: setStyles()});
    // Sets Marker on Map for Current Location
    let marker = new google.maps.Marker({
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      position: origin,
    });
    new mapEvents.ClickEventHandler(google, map, origin);
    mapEvents.addPointEventHandler();
    // mapEvents.getClickCoordinates(map);
  });
};

let getCurrentLocation = function() {
  let options = {
    enableHighAccuracy: true
  };
  function success(position) {
    let crds = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    removeLoaderScreen();
    initMap(crds);
  }
  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  navigator.geolocation.getCurrentPosition(success, error, options);
};

let initialEventHandlers = function() {
  getCurrentLocation();
};

module.exports = {
 initialEventHandlers,
};
