console.log("CoVid19-Project here");

var myMap = L.map("map", {
  center: [39.8283, -98.5795],
  // zoom: 3.2,
  zoom: 5,
});

// Create the streets tile layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18, 
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

// Map the user date selection to a data file
function getGeojsonFile(selDate) {
  var f = (selDate == "Date1") ? "01_22-2020":
	(selDate == "Date2") ? "01_30-2020":
	(selDate == "Date3") ? "02_07-2020":
	(selDate == "Date4") ? "02_15-2020":
	(selDate == "Date5") ? "02_23-2020":
	(selDate == "Date6") ? "03_02-2020":
	(selDate == "Date7") ? "03_10-2020":
	(selDate == "Date8") ? "03_16-2020":
	(selDate == "Date9") ? "03_25-2020":
  "04_01-2020";

  geojsonFile = "static/data/" + f + ".geojson";
  return geojsonFile;
}

// A sleep function that loops until the elapsed time is detected
function sleep(milliseconds) { 
  let timeStart = new Date().getTime(); 
  while (true) { 
    let elapsedTime = new Date().getTime() - timeStart; 
    if (elapsedTime > milliseconds) { 
      break; 
    } 
  } 
} 

// Initializes the page with the heatmap for the middle day
function init() {
  geojson_file = "static/data/02_23-2020.geojson"
  updateHeatMap(geojson_file);
};

// Call updateMap() when a change takes place to the DOM
d3.selectAll("#selDate").on("change", updateMap);

// This function is called when a dropdown menu item is selected
function updateMap() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDate");
  // Assign the value of the dropdown menu option to a variable
  var selectedDate = dropdownMenu.property("value");

  // If the user selects animation, then step through each date and update the overlay
  // There is a delay between steps, but since the updateHeatMp() is asynchronous,
  // the delay is put there to delay the return back to this loop
  if (selectedDate == "Animate") {
    for (var i = 1; i < 11; i++) { 
      geojson_file = getGeojsonFile("Date" + i);
      updateHeatMap(geojson_file);
    }

  } else {
    // Get the GeoJSON file that corresponds to the 
    // user selected date
    geojson_file = getGeojsonFile(selectedDate);
    console.log(`geojson_file: ${geojson_file}`); 

    updateHeatMap(geojson_file);
  }
}  // end of updateMap()


var heat;

//Create a heatmap layer using the GeoJSON file 
// that the user selected
function updateHeatMap(geojson_file) {
  // var url = "http://localhost:8000/date=40";
  d3.json(geojson_file, function(response) {
    // console.log("response.features");
    // console.log(response.features);

    var heatArray = [];

    var covidCases = response.features;

    covidCases.forEach(function(covidCase) {
      latlon = [covidCase.geometry.coordinates[0], covidCase.geometry.coordinates[1]];

      // console.log("latlon");
      // console.log(latlon);
      heatArray.push(latlon)
    });

    console.log("heatArray")
    console.log(heatArray)

    // myMap.removeLayer(heat);

    heat = L.heatLayer(heatArray, {
      radius: 20,
      blur: 2
    }).addTo(myMap);

  // The last step in the asynchronous d3.json() is a delay to support the animation
  sleep(1000);  // milliseconds

  });  // end of d3.json()

};  // end of updateHeatmap()

// Initialize the page with the heatmap for the middle day
init();