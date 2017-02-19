var dict = {};

function Space(location) {
    this.location = location;
    this.spots = 0;
    this.avaliable = 0;
    this.lat = 0;
    this.lng = 0;
}


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCFqDLWambpuB9pzwzUg79caJSS8beiJOk",
    authDomain: "monitoringdb-a8f73.firebaseapp.com",
    databaseURL: "https://monitoringdb-a8f73.firebaseio.com",
    storageBucket: "monitoringdb-a8f73.appspot.com",
    messagingSenderId: "770776827709",
};
firebase.initializeApp(config);
var db = firebase.database();


db.ref('devicelist/').once('value', function(snapshot) {
    snapshot.forEach(function(chdSnapshot) {
        updateList(chdSnapshot.val().location, chdSnapshot.val());
    });
    pushToWeb();
}, function(err) {console.log(err)} );


db.ref('devicelist/').on('child_changed', function(data) {
    console.log("update");
    if(data.val().status == 0) {
        dict[data.val().location].avaliable++;
    }
    else {
        dict[data.val().location].avaliable--;
    }
    
    updateWeb(dict[data.val().location]);
});


function pushToWeb() {
    var tr, th;
    var table = document.getElementById("spot-list");
    
    for(var s in dict) {
        tr = document.createElement("tr");
        
        th = document.createElement("th");
        th.id = dict[s].location;
        th.innerHTML = dict[s].location;
        tr.appendChild(th);
        
        th = document.createElement("th");
        th.id = "th-" + dict[s].location + "-aval";
        th.innerHTML = dict[s].avaliable + " of " + dict[s].spots + " avaliable";
        tr.appendChild(th);
        
        th = document.createElement("th");
        var str = "GO";
        th.innerHTML = str.link("http://maps.google.com/?q=" + dict[s].lat + "," + dict[s].lng);
        tr.appendChild(th);
        
        table.appendChild(tr);
    }    
}


function updateWeb(space) {
    var th = document.getElementById("th-" + space.location + "-aval");
    th.innerHTML = space.avaliable + " of " + space.spots + " avaliable";
}


function updateList(location, data) {
    if(location == null)    return;
    
    if (!(location in dict)) {
        var space = new Space(location);
        dict[location] = space;
    }
    dict[location].spots++;
    if(data.status == 0) {
        dict[location].avaliable += 1;
    }
    dict[location].lat = data.lat;
    dict[location].lng = data.lng;
}


//initialize map
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14,
      mapTypeId: 'roadmap',
    });
    
    var mpos = {lat: 40.902075, lng: -73.134234};
    var marker = new google.maps.Marker({
      position: mpos,
      map: map
    });

    marker.addListener('click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + 
                              'Place ID: ' + place.place_id + '<br>' +
                              place.formatted_address + '</div>');
        infowindow.open(map, this);
    });
    
    mpos = {lat: 40.903972, lng: -73.134724};
    marker = new google.maps.Marker({
      position: mpos,
      map: map
    });

    marker.addListener('click', function() {
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + 
                              'Place ID: ' + place.place_id + '<br>' +
                              place.formatted_address + '</div>');
        infowindow.open(map, this);
    });
    
    //set current position as center
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            map.setCenter(pos);
        }, function() { handleLocationError(true, infoWindow, map.getCenter()); });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}