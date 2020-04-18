
$(document).ready(function() {

// CLICK EVENT ON SUBMIT BUTTON - AJAX CALL INSIDE
$("#searchBtn").on("click", function (event) {
    event.preventDefault();
    console.log("button clicked");
    var userSearch = $("#location-search").val();
    console.log(userSearch);
    var cityNameQueryURL = "https://api.opencagedata.com/geocode/v1/json?q=" + userSearch + "&key=3cc36a63992d44a2af35f53240a19709";

// AJAX CALL FROM USER INPUT (CITY NAME/ZIP CODE) TO GRAB LATITUDE AND LONGITUDE 
    $.ajax({
        url: cityNameQueryURL,
        method: 'GET',
    }).done(function(response){
        console.log(response);
        var lat = response.results[0].geometry.lat;
        console.log("Lat: " + lat);
        var long = response.results[0].geometry.lng;
        console.log("Long: " + long);
        var location = lat + "," + long;
        return location;

    })
  });
});
  