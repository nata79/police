//= require jquery
//= require moment
//= require moment/pt
//= require_tree ../templates

var map;
var timeouts = {};
var polices = [];

function initialize() {
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

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
        icon: "/assets/you.png"
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
    polices.forEach(function(police) {
      police.remove = true;
    });
    // update polices
    data.forEach(updatePolice);
    // remove not updated ones
    for (var i = 0; i < polices.length;) {
      if (polices[i].remove) {
        polices[i].marker.setMap(null);
        polices.splice(i, 1);
      } else i++;
    }
  });
  clearTimeout(timeouts.update);
  timeouts.update = setTimeout(update, 60000);
}

function updatePolice(p) {
  var police = findPolice(p);
  if (police) {
    // update police attributes
    for (var i in p) {
      police[i] = p[i];
    }
    police.infowindow.setContent(JST.info(police));
    police.remove = false;
  } else {
    createMarker(p);
    p.remove = false;
  }
}

function findPolice(police) {
  for (var i = 0; i < polices.length; i++) {
    if (polices[i].id == police.id) return polices[i];
  }
  return false;
}

function createMarker(police) {
  police.marker = new google.maps.Marker({
    position: new google.maps.LatLng(police.latitude, police.longitude),
    map: map,
    icon: "/assets/"+police.type+".png"
  });

  police.infowindow = new google.maps.InfoWindow({
    content: JST.info(police)
  });
  google.maps.event.addListener(police.marker, 'click', function() {
    polices.forEach(function(police) {
      police.infowindow.close();
    });    
    police.infowindow.open(map, police.marker);
  });
  polices.push(police);
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
    $.post("police",
    {
      latitude: $.new_marker.getPosition().lat(),
      longitude: $.new_marker.getPosition().lng(),
      type: $.new_marker_type
    },
    function(data) {
      $('[data-submit]').hide();
      $('[data-create]').show();

      $.new_marker_type = null;
      $.new_marker.setMap(null);
      $.new_marker = null;

      createMarker(data);
    });
  });

  $(document).on("click", "[data-refresh]", function() {
    $.post("refresh", {
      id: $(this).attr("data-refresh")
    }, updatePolice);
  });

  $(document).on("click", "[data-report]", function() {
    $.post("report", {
      id: $(this).attr("data-report")
    }, updatePolice);
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


// Social networks

$(function(){
  
});
