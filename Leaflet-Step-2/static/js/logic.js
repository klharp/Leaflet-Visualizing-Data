console.log("logic file");

// Folow syntax of Mapping I, lesson 10

// Create map object
var myMap = L.map("map", {
    center: [40.5, -99.5],
    zoom: 5
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
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

console.log(platesUrl);

// Perform a GET request to the query URL
d3.json(queryUrl).then(function (data) {

    // Function to color cicles according to depth
    function getColor(colors) {
        return colors >= 25 ? "#ff0a0a" :
        colors >= 20 ? "#fd8a14" :
        colors >= 15 ? "#f2ce02" :
        colors >= 10 ? "#ebff0a" :
        colors >= 5 ? "#85e62c" :
        colors >= 1 ? "#209c05" : "#209c05";
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
            fillOpacity: .8,
            fillColor: getColor(coordinates[2]),
            color: "white",
            weight: 0.5,
            radius: magnitudes * 15000
        }).bindPopup("<h3>" + features[i].properties.place +
            "</h3><hr><p>" + new Date(features[i].properties.time) +
            "<br>" + '[lat: ' + coordinates[1] + ", lng: " + coordinates[0] + ", depth: " + coordinates[2] + "]" + "</p>").addTo(myMap);
    }

    // Colors for legend
    function getColor2(colors) {
        return colors === "<5" ? "#209c05" :
        colors === "5-10" ? "#85e62c" :
        colors === "10-15" ? "#ebff0a" :
        colors === "15-20" ? "#f2ce02" :
        colors === "20-25" ? "#fd8a14" :
        colors === "25+" ? "#ff0a0a" : "#ff0a0a";
    }

    // Create legend object
    var legend = L.control({
        position: "bottomright"
    });

    // Add legend details
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend");
        var depth = ["<5", "5-10", "10-15", "15-20", "20-25", "25+"];
        var colors = ["#209c05", "#85e62c", "#ebff0a", "f2ce02", "fd8a14", "#ff0a0a","ff0a0a"];

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

// Add layer control
// Create basemap object
var grayscale = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "light-v10",
    accessToken: API_KEY
});

var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",
    accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "outdoors-v11",
    accessToken: API_KEY
});

// Create basemap object
var baseMaps = {
    "grayscale": grayscale,
    "satellite": satellite,
    "outdoors": outdoors,
  };

  // Initialize layer groups
  // need correct names
  var layers = {
    EARTHQUAKES: new L.LayerGroup(),
    TECTONIC_LINE: new L.LayerGroup()
  };
  
  // Create overlay object to add to layer control
  var overlayMaps = {
    "EarthQuakes": layers.EARTHQUAKES,
    "Faultlines": layers.TECTONIC_LINE
  };
  
  // Add layer control to map
  // Null to hide the baseMap
  L.control.layers(baseMaps, overlayMaps, {
    //collapsed:false
  }).addTo(myMap);