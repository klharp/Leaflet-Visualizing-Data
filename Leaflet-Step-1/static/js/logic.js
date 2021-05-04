console.log("logic file");

// Folow syntax of Mapping I, lesson 10

// Create map object
var myMap = L.map("map", {
    center: [33.5, -99.5],
    zoom: 4
});

// Adding light mode tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// Store API endpoint 
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Grab the data with d3
d3.json(queryUrl).then(function (data) {

    // Create function to color cicles according to earthquake magnitudes
    function getColor(colors) {
        return colors >= 5 ? "red" :
        colors >= 4 ? "orange" :
        colors >= 3 ? "yellow" :
        colors >= 2 ? "green" :
        colors >= 1 ? "blue" : "purple";
    }

    // Grab the features data
    var features = data.features;

    for (var i = 0; i < features.length; i++) {

        //Define variable magnitudes and coordinates of the earthquakes
        var magnitudes = features[i].properties.mag;
        var coordinates = features[i].geometry.coordinates;

        // Add circles to map
        L.circle(
            [coordinates[1], coordinates[0]], {
            fillOpacity: 0.5,
            fillColor: getColor(magnitudes),
            color: "black",
            weight: 0.5,
            radius: magnitudes * 15000
        }).bindPopup("<h3>" + features[i].properties.place +
            "</h3><hr><p>" + new Date(features[i].properties.time) +
            '<br>' + '[' + coordinates[1] + ', ' + coordinates[0] + ']' + "</p>").addTo(myMap);
    };

    // // Legend for the chart
    // var legend = L.control({ position: 'bottomright' });
    // legend.onAdd = function () {

    //     var div = L.DomUtil.create('div', 'info legend'),
    //         grades = [0, 1, 2, 3, 4, 5],
    //         labels = [];

    //     // loop through our magnitude intervals and generate a label with a colored square for each interval
    //     for (var i = 0; i < grades.length; i++) {
    //         div.innerHTML +=
    //             '<i style="background:' + getColor(grades[i]) + '"></i> ' +
    //             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    //     }
    //     return div;
    // };
    // legend.addTo(myMap);
});