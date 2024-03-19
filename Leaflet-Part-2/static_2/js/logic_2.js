// Defining the URL of the GeoJSON earthquake data
let earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Defining the URL of the GeoJSON tectonic plates data
let tectonicPlatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Creating a Leaflet map
let myMap = L.map("map").setView([37.09, -95.71], 5);

// Defining tile layers for satellite, terrain, and outdoors maps
let satelliteLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
});

let terrainLayer = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.opentopomap.org/'>OpenTopoMap</a> contributors"
  }).addTo(myMap);

let outdoorsLayer = L.tileLayer("https://{s}.tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=2afb3dc84b304c3a824b470c7a332704", {
  attribution: "&copy; <a href='https://www.thunderforest.com/outdoors/' target='_blank'>Thunderforest Outdoors</a> & contributors"
});

// Defining an overlay layer group for earthquakes
let earthquakesLayer = L.layerGroup();

// Defining an overlay layer group for tectonic plates
let tectonicPlatesLayer = L.layerGroup();

// Fetching the GeoJSON earthquake data
fetch(earthquakeUrl)
  .then(response => response.json())
  .then(data => {
    // Creating a GeoJSON layer for the earthquake data
    L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: feature.properties.mag * 5,
          fillColor: getColor(feature.properties.mag),
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
      }
    }).addTo(earthquakesLayer);
  })
  .catch(error => console.error("Error fetching earthquake data:", error));

// Fetching the GeoJSON tectonic plates data
fetch(tectonicPlatesUrl)
  .then(response => response.json())
  .then(data => {
    // Creating a GeoJSON layer for the tectonic plates data
    L.geoJSON(data, {
      style: function (feature) {
        return {
          color: "red",
          weight: 2
        };
      }
    }).addTo(tectonicPlatesLayer);
  })
  .catch(error => console.error("Error fetching tectonic plates data:", error));

// Function to determine color based on earthquake magnitude
function getColor(magnitude) {
  return magnitude > 5 ? "#e31a1c" :
         magnitude > 4 ? "#fd8d3c" :
         magnitude > 3 ? "#feb24c" :
         magnitude > 2 ? "#fed976" :
                         "#ffeda0";
}

// Creating an object to hold base layers
let baseMaps = {
  "Satellite": satelliteLayer,
  "Topographic": terrainLayer,
  "Outdoors": outdoorsLayer
};

// Creating an object to hold overlay layers
let overlayMaps = {
  "Earthquakes": earthquakesLayer,
  "Tectonic Plates": tectonicPlatesLayer
};

// Adding layer controls to the map
L.control.layers(baseMaps, overlayMaps).addTo(myMap);

// Adding the default layers to the map
satelliteLayer.addTo(myMap);
earthquakesLayer.addTo(myMap);
