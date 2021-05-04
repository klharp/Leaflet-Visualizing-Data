console.log("logic file");

// Folow syntax of Mapping I, lesson 10

// Define tile layer and add to the map
// L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//     maxZoom: 18,
//     id: "light-v10",
//     accessToken: API_KEY
// }).addTo(myMap);

// Store API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
var platesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

console.log(platesUrl);

// Create base layers
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
var layers = {
    earthquakes: new L.LayerGroup(),
    tectonicplates: new L.LayerGroup()
};


// Create map object
var myMap = L.map("map", {
    center: [30.5, -50.5],
    zoom: 3,
    layers: [layers.earthquakes, layers.tectonicplates]
});

// Add grayScale layer to the map
grayscale.addTo(myMap);


// Create overlay object to add to layer control
var overlayMaps = {
    "Earthquakes": layers.earthquakes,
    "Tectonic Plates": layers.tectonicplates
};

// Add layer control to map
L.control.layers(baseMaps, overlayMaps, {
}).addTo(myMap);


//Peform a Get request to platesUrl for the tectonic data
d3.json(platesUrl).then(function(tectonics) {

	// Grab the features tectonic data
	var tectonicFeatures = tectonics.features;

	for (var i = 0; i < tectonicFeatures.length; i++) {

		// Because the coordinates in geojson are ordered reversely against what 
		// should be passed into Leaflet to be rendered correctly, we'll create an array to
		// reorder each pair of coordinates
		var coordinates = tectonicFeatures[i].geometry.coordinates;

		var orderedCoordinates = [];

		orderedCoordinates.push(
			coordinates.map(coordinate => [coordinate[1], coordinate[0]])
		);

		// Create tectonic lines
		var lines = L.polyline(orderedCoordinates, {color: "rgb(255, 165, 0)"});
		
		// Add the new marker to the appropriate layer
		lines.addTo(layers.tectonicplates);
	};
});



// Perform a GET request to queryUrl for the earthquake data
d3.json(queryUrl).then(function(data) {

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
            "<br>" + '[lat: ' + coordinates[1] + ", lng: " + coordinates[0] + ", depth: " + coordinates[2] + "]" + "</p>").addTo(layers.earthquakes);
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
        var colors = ["#209c05", "#85e62c", "#ebff0a", "f2ce02", "fd8a14", "#ff0a0a", "ff0a0a"];

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
    legend.addTo(layers.earthquakes);
});

