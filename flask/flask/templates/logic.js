//Create map object
var myMap = L.map("map", {
    center: [39.8097343, -98.5556199],
    zoom: 3
  });

// Create map background
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);


var cases_path = '../../../data/time_series_covid19_confirmed_US.geojson'
var deaths_path = '../../../data/time_series_covid19_deaths_US.geojson'

cases = d3.json(cases_path)
deaths = d3.json(deaths_path)

console.log(cases)
console.log(deaths)