// Defining the GeoJSON earthquake data
let earthquakeData;

// Defining the URL of the GeoJSON earthquake data
let geoJsonUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Fetching the GeoJSON data
fetch(geoJsonUrl)
  .then(response => response.json())
  .then(data => {
    // Assigning data to the earthquakeData variable
    earthquakeData = data;
    
    // Calling the function to create the map and visualize the earthquake data
    createMap();
  })
  .catch(error => console.error("Error fetching earthquake data:", error));

// Creating a function to create the Leaflet map and visualize the earthquake data
function createMap() {
  // Creating a Leaflet map
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });

  // Defining streetmap layer
  let streetmap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(myMap);

  // Creating a function to style each earthquake feature
  function style(feature) {
    return {
      radius: markerSize(feature.properties.mag),
      fillColor: markerColor(feature.geometry.coordinates[2]), // Using depth for color
      color: "#000",
      weight: 0.3,
      opacity: 0.5,
      fillOpacity: 1
    };
  }

  // Creating a function to bind a popup to each earthquake feature
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + "</p><p>Magnitude: " + feature.properties.mag + "</p><p>Depth: " + feature.geometry.coordinates[2] + " km</p>");
  }

  // Creating a GeoJSON layer for the earthquake data
  L.geoJSON(earthquakeData, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng, style(feature));
    },
    onEachFeature: onEachFeature
  }).addTo(myMap);

  // Creating a legend
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function(map) {
    let div = L.DomUtil.create("div", "info legend");
    let depths = [-10, 10, 30, 50, 70, 90];
    let labels = [];
    let legendInfo = "<strong>Depth</strong>";
    div.innerHTML = legendInfo;
    for (let i = 0; i < depths.length; i++) {
      labels.push('<li style="background-color:' + markerColor(depths[i] + 1) + '"> <span>' + depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+ km') + '</span></li>');
    }
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
  legend.addTo(myMap);
}

// Creating a function to determine marker size based on magnitude
function markerSize(magnitude) {
  return magnitude * 5;
}

// Creating a function to determine marker color based on depth
function markerColor(depth) {
  if (depth < 10) {
    return "#91cf60";
  } else if (depth < 30) {
    return "#d9ef8b";
  } else if (depth < 50) {
    return "#fee08b";
  } else if (depth < 70) {
    return "#fdae61";
  } else if (depth < 90) {
    return "#f46d43";
  } else {
    return "#d73027";
  }
}
