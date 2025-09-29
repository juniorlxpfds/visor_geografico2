// Inicialización del mapa — centra en Pachacutec / Ventanilla (ajusta coordenadas)
var map = L.map('map').setView([-11.862, -77.141], 15);

// Capas base
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

var esriSat = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri'
});

// Capas vacías que luego cargaremos vía GeoJSON
var capaVias = L.geoJSON(null, {
  style: {
    color: '#555',
    weight: 1.5
  }
}).addTo(map);

var capaLotes = L.geoJSON(null, {
  style: function(feature) {
    return {
      color: '#228B22',
      weight: 1,
      fillOpacity: 0.5
    };
  },
  onEachFeature: function(feature, layer) {
    layer.on({
      click: function(e) {
        var props = feature.properties;
        var contenido = '<h4>Información del Lote</h4>';
        for (var key in props) {
          contenido += key + ': ' + props[key] + '<br>';
        }
        layer.bindPopup(contenido).openPopup();
      }
    });
  }
}).addTo(map);

var capaPerimetro = L.geoJSON(null, {
  style: {
    color: '#FF0000',
    weight: 2,
    fillOpacity: 0
  }
}).addTo(map);

// Control de capas
var baseMaps = {
  "OpenStreetMap": osm,
  "Satélite Esri": esriSat
};
var overlayMaps = {
  "Vías": capaVias,
  "Lotes / Manzanas": capaLotes,
  "Perímetro": capaPerimetro
};
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Geocoder
if (typeof L.Control.Geocoder !== 'undefined') {
  L.Control.geocoder({
    defaultMarkGeocode: true
  }).addTo(map);
}

// Leyenda
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = '<strong>Capas</strong><br>' +
                  '<i style="background: #555; width:10px; height:2px; display:inline-block;"></i> Vías<br>' +
                  '<i style="background: #228B22; width:10px; height:10px; display:inline-block;"></i> Lotes / Manzanas<br>' +
                  '<i style="border:2px solid #FF0000; width:0; height:0; display:inline-block;"></i> Perímetro';
  return div;
};
legend.addTo(map);

// Función para cargar GeoJSON
function cargarGeoJSON(url, capa) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      capa.addData(data);
    })
    .catch(err => {
      console.error('Error cargando ' + url + ': ' + err);
    });
}

// Aquí pones tus rutas de archivos
cargarGeoJSON('vias.geojson', capaVias);
cargarGeoJSON('lotes.geojson', capaLotes);
cargarGeoJSON('perimetro.geojson', capaPerimetro);
