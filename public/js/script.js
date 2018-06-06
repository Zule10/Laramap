var map;
var myLatLng;

$(document).ready(function(){

    geoLocationInit();

   function geoLocationInit(){
       if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(success,fail);
       }else{
           alert("Browser not supported");
       }
   }
   
   function success(position){

       console.log(position);

       var latval=position.coords.latitude;
       var lngval=position.coords.longitude;

       myLatLng = new google.maps.LatLng(latval,lngval);
       createMap(myLatLng);
       //nearbySearch(myLatLng,"school");

   }

   function fail(){
       alert("it fails");
   }
   
    //CreateMap

    function createMap(myLatLng){
        map = new google.maps.Map(document.getElementById('map'), {
            center:myLatLng,
            zoom:12
        });

        var marker = new google.maps.Marker({
            position: myLatLng,
            map: map,
            
        });

        var input = document.getElementById('searchmap');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
       // var markers = [];
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();
            
            if (places.length == 0) {
                return;
            }
            /*markers.forEach(function(marker) {
                marker.setMap(null);
              });
              markers = [];*/
            
       
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
               /* markers.push(new google.maps.Marker({
                    map: map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                  }));*/
              
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
               
            });
            map.fitBounds(bounds);

            
        });
    }   

    //CreateMarker

    function createMarker(latlng,icn,name){
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            icon: icn,
            title: name
          });
    }    

    //NearbySearch

    function nearbySearch(myLatLng,type){

        var request = {
            location: myLatLng,
            radius: '1500',
            types: [type]

        };

        service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request,callback);

        function callback(results, status) {
            //console.log(results);
            //if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];
                latlng= place.geometry.location;
                icn='https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
                name=place.name;
                createMarker(latlng,icn,name);
            }
            //}
        }
    }   
});