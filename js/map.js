var map;
var geocoder;
var markers = [];
var examplePins = [];

// FILLING THE MAP
function fillPersonalPins() {
  // ON THIS MAP, FILL WITH PREVIOUSLY STORED PINS
  var options = {
    url: 'https://quiet-meadow-73921.herokuapp.com/pins',
    headers: {
      'Authorization': 'Bearer ' + Lockr.get('idToken')
    }
  };
  var request = $.ajax(options);
  request.done(function(response) {
    console.log(response);
    var infowindow = new google.maps.InfoWindow()
    for (var i = 0; i < response.length; i++) {
      var marker = new google.maps.Marker({
        map: map,
        position: {
          lat: response[i].lat,
          lng: response[i].lon
        },
        journal: response[i].journal,
        date: response[i].date,
        location: response[i].location,
        user: response[i].user,
        infowindow: infowindow,
        _id: response[i]._id,
        index: i
      });
      markers.push(marker);

      google.maps.event.addListener(marker, 'click', function() {
        console.log(this);
        this.infowindow.setContent(
          `City: ${this.location}<br>
           Date: ${this.date}<br>
           Journal: ${this.journal}
           <hr>
           <span style='font-weight: bold' id='delete'>Delete Pin</span>`
         );
        infowindow.open(map, this);
      });

      google.maps.event.addListener(marker, 'click', function(e) {
        console.log(this);
        var index = this.index;
        const thismarker = e.currentTarget;
        $('#delete').click(function(thismarker) {
          console.log(thismarker);
          markers[index].setMap(null);
          var options = {
            url: 'https://quiet-meadow-73921.herokuapp.com/pins/' + markers[index]._id,
            method: 'DELETE',
            headers: {
              'Authorization': 'Bearer ' + Lockr.get('idToken')
            }
          }
          var request = $.ajax(options);
        });
      });
    };
  });
  request.fail(function(jqXHR, textStatus, errorThrown) {
    console.log('errorThrown: ', errorThrown);
  });
};

function ajaxPost(custom_data) {
  console.log(custom_data);
  var options = {
    url: 'https://quiet-meadow-73921.herokuapp.com/pins',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + Lockr.get('idToken')
    },
    data: {
      location: custom_data.address,
      journal: custom_data.journal,
      date: custom_data.date,
      user: custom_data.user,
      lat: custom_data.lat,
      lon: custom_data.lon
      // potentially add other defining information here
    }
  };

  var request = $.ajax(options);
  request.fail(function(jqXHR, textStatus, errorThrown) {
    console.log('errorThrown: ', errorThrown);
  });
};
