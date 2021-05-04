console.log("logic file");

// Folow syntax of Mapping I, lesson 10

// Variable for API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});


function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}


// Creating map object
var myMap = L.map("map", {
    center: [40.7128, -94.0059],
    zoom: 4
});

// Adding tile layer
var greyMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 8,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

greyMap.addTo(myMap);

// Perform GET request to the query url
d3.json(queryUrl, function (data) {

    // Grab the features data
    var features = data.features;

    for (var i = 0; i < features.length; i++) {

        //Define magnitudes and coordinates of the earthquakes
        var magnitudes = features[i].properties.mag;
        var coordinates = features[i].geometry.coordinates;

        // Creating a GeoJSON layer with the retrieved data
        L.geoJson(data).addTo(myMap);
    }
});


//Retrieve the features
// var features = data.features;
// console.log(features);



// Adding legend
// var legend = L.control({position: "bottomright"})

// look at mapping class 1, exercise 8 & 9 for looping and pushing markers.

// look at mapping class 1, exercise 10 for geoexample