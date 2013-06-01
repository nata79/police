//= require jquery


function initialize() {
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var timeouts = {};
  google.maps.event.addListener(map, "bounds_changed", function() {
    clearTimeout(timeouts.police);
    timeouts.police = setTimeout(function() {
      update(map);
    }, 500);
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

function update(map) {
  var url = "police" +
            "?latitude=" + map.getCenter().lat() +
            "&longitude=" + map.getCenter().lng() +
            "&radius=20";
  $.get(url, function(data) {
    console.log(data);
  });
}

function radius(bounds) {
  center = bounds.getCenter();
  ne = bounds.getNorthEast();

  var r = 6.371; // radius of the earth in kilometers

  // Convert lat or lng from decimal degrees into radians (divide by 57.2958)
  var lat1 = center.lat() / 57.2958;
  var lon1 = center.lng() / 57.2958;
  var lat2 = ne.lat() / 57.2958;
  var lon2 = ne.lng() / 57.2958;

  // circle radius from center to northeast corner of bounds
  return r * Math.acos(Math.sin(lat1) * Math.sin(lat2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1));
}

google.maps.event.addDomListener(window, 'load', initialize);
