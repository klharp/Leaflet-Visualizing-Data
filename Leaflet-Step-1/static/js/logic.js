console.log("logic file");

// Folow syntax of Mapping I, lesson 10

// Create map object
var myMap = L.map("map", {
    center: [33.5, -99.5],
    zoom: 4
});

// Define tile layer and add to the map
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
}).addTo(myMap);

// Store API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {

    // Function to color cicles according to depth
    function getColor(colors) {
        return colors >= 25 ? "#023762" :
        colors >= 20 ? "#01579b" :
        colors >= 15 ? "#0288d1" :
        colors >= 10 ? "#03a9f4" :
        colors >= 5 ? "#4fc3f7" :
        colors >= 1 ? "#b3e5fc" : "#b3e5fc";
    }

    // Loop through data and grab the features data
    var features = data.features;

    for (var i = 0; i < features.length; i++) {

        //Variables for magnitudes and coordinates 
        var magnitudes = features[i].properties.mag;
        var coordinates = features[i].geometry.coordinates;

        // Add circles to map
        L.circle(
            [coordinates[1], coordinates[0]], {
            fillOpacity: 1,
            fillColor: getColor(coordinates[2]),
            color: "white",
            weight: 0.5,
            radius: magnitudes * 10000
        }).bindPopup("<h3>" + features[i].properties.place +
            "</h3><hr><p>" + new Date(features[i].properties.time) +
            "<br>" + '[lat: ' + coordinates[1] + ", lng: " + coordinates[0] + ", depth: " + coordinates[2] + "]" + "</p>").addTo(myMap);
    }

    // Colors for legend
    function getColor2(colors) {
        return colors === "<5" ? "#b3e5fc" :
        colors === "5-10" ? "#4fc3f7" :
        colors === "10-15" ? "#03a9f4" :
        colors === "15-20" ? "#0288d1" :
        colors === "20-25" ? "#01579b" :
        colors === "25+" ? "#023762" : "#023762";
    }

    // Create legend object
    var legend = L.control({
        position: "topright"
    });

    // Add legend details
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var depth = ["<5", "5-10", "10-15", "15-20", "20-25", "25+"];
        var colors = ["#b3e5fc", "#4fc3f7", "#03a9f4", "0288d1", "01579b", "#023762","023762"];

        var labels = ["<b>Depth (m)</b>"];

        console.log(colors);
        console.log(depth);
        console.log(labels);

        // loop through magnitude intervals and generate a label with a colored square 
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                labels.push(
                    '<i style="background:' + getColor2(depth[i]) + '"></i> ' + (depth[i] ? depth[i] : '+'));
        }

        div.innerHTML = labels.join('<br>');
        return div;
    }

    //Add legend to map
    legend.addTo(myMap);
});