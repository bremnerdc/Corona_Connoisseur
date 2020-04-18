$(document).ready(function() {

  // LOCATION BUTTON SEARCH
  $("#locationBtn").on("click", function (event){
      event.preventDefault();
      console.log("location clicked");
      $("#restaurants").empty();
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
      } else {
          alert("Geolocation is not supported by this browser.");    
    }
  })

  function showPosition(position) {
      var lat = position.coords.latitude;
      var long = position.coords.longitude;
      var location = lat + "," + long;
      searchRestaurants(location);
  };

  // RANGE DROPDOWN BUTTON ACTIVATION
  $(".dropdown-trigger").dropdown();

  // CLICK EVENT ON SUBMIT BUTTON - OPEN CAGE DATA AJAX CALL INSIDE
      $("#searchBtn").on("click", function (event) {
      event.preventDefault();
      console.log("button clicked");
      $("#restaurants").empty();
      var userSearch = $(".validate").val();
      var cityNameQueryURL = "https://api.opencagedata.com/geocode/v1/json?q=" + userSearch + "&key=3cc36a63992d44a2af35f53240a19709";
  
  // AJAX CALL FROM USER INPUT (CITY NAME/ZIP CODE) TO GRAB LATITUDE AND LONGITUDE 
      $.ajax({
          url: cityNameQueryURL,
          method: 'GET',
      }).fail(function(response){
          $(".modal").modal();
          $("#failed-search-modal").modal('open');
      
      }).done(function(response){
          var lat = response.results[0].geometry.lat;
          var long = response.results[0].geometry.lng;
          var location = lat + "," + long;
          searchRestaurants(location);
      });
  });

  // MAIN SEARCH FUNCTION
  function searchRestaurants(location) {
      
          var queryURL;
          var searchRadius;

  // RADIO BUTTONS FOR SEARCH RANGE
      if ($("#1mile").prop("checked")) {
          searchRadius = "1600";
      } 
      else if ($("#2miles").prop("checked")) {
          searchRadius = "3200";
      }
      else if ($("#5miles").prop("checked")) {
          searchRadius = "8000";
      }
      else if ($("#10miles").prop("checked")) {
          searchRadius = "16000";
      }
      else if ($("#20miles").prop("checked")) {
          searchRadius = "32100";
      } else {
          searchRadius = "10000"
      }

  // RADIO BUTTONS FOR TAKEAWAY AND DELIVERY     
      if ($("#delivery").prop("checked")) {
              queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + location + "&radius=" + searchRadius + "&type=meal_delivery&opennow=true&key=AIzaSyApNMnp_rkqJzxJaSxvpit0MvEhVw1vm7c";
      }
      else if ($("#takeaway").prop("checked")) {
              queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + location + "&radius=" + searchRadius + "&type=meal_takeaway&opennow=true&key=AIzaSyApNMnp_rkqJzxJaSxvpit0MvEhVw1vm7c";
      } else {
              queryURL = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + location + "&radius=" + searchRadius + "&type=restaurant&opennow=true&key=AIzaSyApNMnp_rkqJzxJaSxvpit0MvEhVw1vm7c";
      };

      $.ajax({
          url: queryURL,
          method: 'GET',
      }).fail(function(response){
          $(".modal").modal();
          $("#failed-search-modal").modal('open');
      
      }).done(function(response){
          console.log(queryURL);

  // MODAL IF CALL GETS ZERO RESULTS
      if (response.status == "ZERO_RESULTS") {
              $(".modal").modal();
              $("#no-results-modal").modal('open');
      }

  // CREATING VARIABLES FROM JSON OBJECT RESULTS 
      for (var i = 0; i < response.results.length; i++) {
      var name = response.results[i].name;
      var rating = response.results[i].rating;
      var address = response.results[i].vicinity;
            

  // CREATING RESTAURANT RESULT ELEMENTS
      var restaurantColDiv = $("<div class='col s12 m6 l6'></div>");
      var restaurantDiv = $("<div class='card-panel indigo lighten-2'></div>");
      var restaurantNameEl = $("<span class='card-title'  id='restaurant-header'>" + name + "</span>");
      var openNowEl = $("<p>OPEN NOW</p>");
      var ratingEl = $("<p>Google rating: " + rating + " / 5" + "</p>");
      var addressEl = $("<p>Address: " + address + "</p>");
      var restaurantContentDiv = $("<div class='card-content white-text'></div>");
      var encodedAddress = encodeURIComponent(address);
      var link = "https://www.google.com/maps/dir/?api=1&destination=" + encodedAddress
      var directionsLink = $("<a target='_blank' href=" + link + ">Directions</a>");

  // APPENDING RESTAURANT ELEMENTS TO PAGE
      restaurantDiv.append(restaurantContentDiv);
      restaurantColDiv.append(restaurantDiv);
      restaurantContentDiv.append(restaurantNameEl);
      restaurantContentDiv.append(openNowEl);
      restaurantContentDiv.append(ratingEl);
      restaurantContentDiv.append(addressEl);
      restaurantContentDiv.append(directionsLink);
      $("#restaurants").append(restaurantColDiv);

      }
    });
  };
});    