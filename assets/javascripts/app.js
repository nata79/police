//= require jquery

var map;

function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      map.setCenter(new google.maps.LatLng(
        position.coords.latitude, position.coords.longitude));
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
    map.setCenter(new google.maps.LatLng(41.162143, -8.621954)); // Porto
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
