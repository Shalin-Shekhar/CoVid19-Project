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
  // accessToken: "pk.eyJ1Ijoic3RodWRpdW0iLCJhIjoiY2s4MXZhZXYxMHN6dzNkcmxmZm95ajVsZCJ9.ARt9J_hnUulmObjE3WGlGA"

}).addTo(myMap);

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

// Initializes the page with the heatmap for the 50th (out of 70) day
function init() {
  updateHeatMap("50");
};

// Call updateMap() when a change takes place to the DOM
d3.selectAll("#selDate").on("change", updateMap);

// This function is called when a dropdown menu item is selected
function updateMap() {
  // Use D3 to select the dropdown menu
  var dropdownMenu = d3.select("#selDate");
  // Assign the value of the dropdown menu option to a variable
  var selectedDate = dropdownMenu.property("value");

  if (selectedDate == "Animate") {
    // If the user selects animation, then step through each date and update the overlay
    // There is a delay between steps, but since the updateHeatMp() is asynchronous,
    // the delay is put there to delay the return back to this loop
    var steps = [0, 15, 28, 39, 45, 52, 58, 62, 66, 70]
    for (var i=0; i<steps.length; i++) {
      updateHeatMap(steps[i]);
    }
  } else {
    // Update the heatmap for the user selected date
    updateHeatMap(selectedDate);
  }
}  // end of updateMap()

//Create a heatmap layer using the GeoJSON file that the user selected
function updateHeatMap(sel_date) {
  url = "http://localhost:5000/date=" + sel_date;
  console.log("url")
  console.log(url)
  d3.json(url, function(response) {
    // console.log("response.features");
    // console.log(response.features);

    var heatArray = [];

    var covidCases = response.features;

    covidCases.forEach(function(covidCase) {
      heatArray.push(covidCase.geometry.coordinates)
    });

    console.log("heatArray")
    console.log(heatArray)

    var heat = L.heatLayer(heatArray, {
      radius: 20,
      blur: 2
    }).addTo(myMap);

  // The last step in the asynchronous d3.json() is a delay to support the animation
  sleep(1000);  // milliseconds

  });  // end of d3.json()

};  // end of updateHeatmap()

// Initialize the page with the heatmap for the middle day
init();