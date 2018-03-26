// BASEMAP

var map = L.map('mainmap', {
    scrollWheelZoom: false,
    maxZoom: 18
}).setView([37.700283, -121.920192], 9);

var tonerUrl = "https://stamen-tiles.a.ssl.fastly.net/toner-lite/{Z}/{X}/{Y}.png";

var url = tonerUrl.replace(/({[A-Z]})/g, function(s) {
    return s.toLowerCase();
});

var basemap = L.tileLayer(url, {
    subdomains: ['','a.','b.','c.','d.'],
    minZoom: 0,
    maxZoom: 20,
    opacity: 0.5,
    type: 'png'
}); 

basemap.addTo(map);


// SYMBOLOGY FUNCTIONS 

function getColor(d) {
        return  d == 'PITT-SFIA (ROUTE 1 2)' ? '#FFF450':
                d == 'FRMT-RICH (ROUTE 3 4)' ? '#F8A01B': 
                d == 'FRMT-DALY (ROUTE 5 6)' ? '#4EB947':
                d == 'RICH-MLBR (ROUTE 7 8)' ? '#DF1255':
                d == 'DUBL-DALY (ROUTE 11 12)' ? '#01ADEF':
                '#AEAFB1'; //OAK Airport Grey
    }

function getRadius(d) {
      if (d == -1) {
        return 5;
      }  
      else {
        return ((d-2.25) + 5);
      }
    }

function setFill(d) {
    if (d == -1) {
        return '#000';
      } 
    else {
      return '#FFF';
    }
}

// INTERACTION

function highlightFeature(e) {

    var layer = e.target;

    layer.setStyle({
        fillColor: '#777'
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

}

function resetHighlight(e) {

    var layer = e.target;

    if (layer.feature.properties.fareEmbarcadero == -1) {
      layer.setStyle({
          fillColor: '#000'
      });
    }
    else {
      layer.setStyle({
          fillColor: '#FFF'
      });
    }

}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
} 

function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, 
        {
            radius: getRadius(feature.properties.fareEmbarcadero),
            color: "#000",
            fillColor: setFill(feature.properties.fareEmbarcadero),
            weight: 3,
            opacity: 1,
            fillOpacity: 1
        }
    );
}

function style(feature) {
    return {
    color: getColor(feature.properties.Name),
    weight: 7,
    opacity: 1,
    };
}

// MAP DATA

// Stations Field Names: 
//
// nameFull nameSimple fareEmbarcadero

lines = L.geoJson(linesBART, {
  style: style
}).addTo(map);

stations = L.geoJson(stationsBART, {
  pointToLayer: pointToLayer,
  onEachFeature: onEachFeature
}).addTo(map);



// POP UPS 

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function unitUnits(x) {
    if (x == 1) 
        {return 'unit'}
    else 
        {return 'units'}
}

stations.bindTooltip(function (layer) {
    return L.Util.template('<b>' + layer.feature.properties.NameFull + '</b>');  
    });

stations.bindPopup(function (layer) {
    if (layer.feature.properties.RailFare__PeakTime < 0) {
      return L.Util.template('<h2>' + layer.feature.properties.NameFull + '</h2>' + 
        'In 2017, Union Station had the highest ridership in the system. This map measures commuting costs to and from here.');
    }
    else {
        return L.Util.template('<h2>' + layer.feature.properties.NameFull + '</h2>' +
            'From here, it costs <b>$' + (layer.feature.properties.fareEmbarcadero).toFixed(2) + '</b> to ride to Embarcadero.' + 
              '<hr style="height:0px; visibility:hidden;" />' +
            'Monthly expense: <b>$' + (40*layer.feature.properties.fareEmbarcadero).toFixed(0) 
            );
    }
});

map.on('popupopen', function(e) {
    var location = map.project(e.popup._latlng); 
    location.y -= e.popup._container.clientHeight/2;
    map.panTo(map.unproject(location),{animate: true});
    $("#legend").css("display","none");
    $(".leaflet-control-container").css("display","none");
});

map.on('popupclose', function(e) {
    $("#legend").css("display","block");
    $(".leaflet-control-container").css("display","block");
});

// GEOCODER 

var searchControl = L.esri.Geocoding.geosearch({
  position:'topleft',
  searchBounds: L.latLngBounds([38.653271, -77.387060],[39.117203, -76.678442])
}).addTo(map);

var results = L.layerGroup().addTo(map);

searchControl.on("results", function(data) {
    results.clearLayers();
    for (var i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
    }
});

// LAYER CONTROL 

var baselayers = {
};

var overlays = {
  "Metro Stations": stations,
  "Metro Lines": lines
};

L.control.layers(baselayers, overlays, {position: 'topright', collapsed: true}).addTo(map);