# Leaflet Homework - Visualizing Data with Leaflet

Did provide a link to GitHub pages due to needing an API key for the mapping. API key is stored in a config.js file and was not pushed to GitHub.

- - -

## Level 1: Basic Visualization

![2-BasicMap](Images/2-BasicMap.png)

### Visualize the Earthquake Data Set.

1. **Get  data set**

   The USGS provides earthquake data in a number of different formats, updated every 5 minutes ([USGS GeoJSON Feed](http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) ). The URL of the chosen JSON pulls in the data for the visualization.

  ![3-Data](Images/3-Data.png)

2. **Import & Visualize the Data**

![3-Data](Images/2-BasicMapZooom.png)

   Created a map using Leaflet that plots all of the earthquakes from the data set based on the longitude and latitude.

   * The data markers reflect the magnitude of the earthquake by their size and the depth of the earthquake by their color. 

   * Included are popups that provide additional information about the earthquake when a marker is clicked.

   * Created a legend that provides context for the map data.

- - -

## Level 2: More Data (Optional)

![Advanced](Images/step2-1.png)

![Advanced](Images/step2-2.png)

![Advanced](Images/step2-3.png)

Pulled in a second data set and visualized it along with original set of data (Step 1). Data on tectonic plates was provided at <https://github.com/fraxen/tectonicplates>.

* Plotted a second data set to the map.

* Configured three base maps to choose from as well as two different data sets as overlays that can be turned on and off independently.

* Added layer controls to the map.

- - -

