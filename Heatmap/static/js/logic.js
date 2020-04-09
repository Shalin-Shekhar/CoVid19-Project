console.log("CoVid19-Project here");

var myMap = L.map("map", {
  // center: [37.7749, -122.4194],
  // zoom: 13
  center: [39.8283, -98.5795],
  zoom: 4
});

// Create the streets tile layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18, 
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// var url = "http://localhost:8000/date=40";
test_file = "static/data/test_2geojson.geojson.txt"
d3.json(test_file, function(response) {
  console.log("response.features");
  console.log(response.features);

  var heatArray = [];

  var covidCases = response.features;

  covidCases.forEach(function(covidCase) {
    //console.log(covidCase.properties.Deaths);
    //for (i=0; i<covidCases)
    latlon = [covidCase.geometry.coordinates[0], covidCase.geometry.coordinates[1]];
    // latlon = covidCase.geometry.coordinates;

    //console.log("latlon");
    //console.log(latlon);
    if(covidCase.properties.Deaths>0){
    for(i=0;i<covidCase.properties.Deaths*450;i++){
        heatArray.push(latlon)
      }
    }
  });

  //console.log("heatArray")
  //console.log(heatArray)

  var heat = L.heatLayer(heatArray, {
    radius: 14
  }).addTo(myMap);

});
