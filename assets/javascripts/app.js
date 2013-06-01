//= require jquery

var map;
var markers = [];

function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var timeouts = {};
  google.maps.event.addListener(map, "bounds_changed", function() {
    clearTimeout(timeouts.police);
    timeouts.police = setTimeout(update, 500);
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
      new google.maps.Marker({
        position: map.getCenter(),
        map: map,
        title: 'This is you! =)'
      });
    });
  } else {
    console.error("Geolocation is not supported by this browser.");
    map.setCenter(new google.maps.LatLng(41.162143, -8.621954)); // Porto
  }
}

function update() {
  var url = "police" +
            "?latitude=" + map.getCenter().lat() +
            "&longitude=" + map.getCenter().lng() +
            "&radius=" + radius(map.getBounds());
  $.get(url, function(data) {
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];
    data.forEach(function(police) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(police.latitude, police.longitude),
        map: map,
        icon: "/assets/"+police.type+".png"
      });
      markers.push(marker);
    });
  });
}

function radius(bounds) {
  center = bounds.getCenter();
  ne = bounds.getNorthEast();

  var r = 6371; // radius of the earth in kilometers

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

$(function(){
  $('[data-create-radar]').click(function(event){
    event.preventDefault();
    create_police('radar');
  });

  $('[data-create-stop]').click(function(event){
    event.preventDefault();
    create_police('stop');
  });

  $('[data-submit-cancel]').click(function(event){
    event.preventDefault();
    $('[data-submit]').hide();
    $('[data-create]').show();    

    $.new_marker_type = null;
    $.new_marker.setMap(null);
    $.new_marker = null;
  });

  $('[data-submit-post]').click(function(event){
    event.preventDefault();
    var url = "/police";
    lat = $.new_marker.getPosition().lat();
    lng = $.new_marker.getPosition().lng();
    $.post(url, 
    {
      latitude: lat,
      longitude: lng,
      type: $.new_marker_type
    },
    function(data) {
      $.new_marker.setDraggable(false);
      markers.push($.new_marker);

      $('[data-submit]').hide();
      $('[data-create]').show();    

      $.new_marker_type = null;
      $.new_marker = null;
    });
  });
});

function create_police(type){
  $.new_marker = new google.maps.Marker({
    position: map.getCenter(),
    map: map,
    draggable: true,
    icon: "/assets/"+type+".png",
    animation: google.maps.Animation.DROP
  });

  $.new_marker_type = type;

  $('[data-create]').hide();
  $('[data-submit]').show();
}

