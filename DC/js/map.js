// BASEMAP

var map = L.map('mainmap', {
    scrollWheelZoom: false,
    maxZoom: 18
}).setView([38.907192, -77.036871], 11);

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
        return  d == 'red' ? '#E51937':
                d == 'yellow' ? '#FFD204': 
                d == 'green' ? '#00A950':
                d == 'blue' ? '#0077C0':
                d == 'silver' ? '#A1A3A1':
                '#F7941E'; //orange
    }

function getRadius(d) {
      if (d == -1) {
        return 5;
      }  
      else {
        return (3*(d-2.25) + 5);
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

    if (layer.feature.properties.RailFare__PeakTime == -1) {
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
            radius: getRadius(feature.properties.RailFare__PeakTime),
            color: "#000",
            fillColor: setFill(feature.properties.RailFare__PeakTime),
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
// Name GIS_ID  WEB_URL ADDRESS LINE  Code  NameFull  RailFare__PeakTime  RailFare__OffPeakTime RailFare__SeniorDisabled  lon lat

lines = L.geoJson(linesWMATA, {
  style: style
}).addTo(map);

stations = L.geoJson(stationsWMATA, {
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
            'From here, it costs <b>$' + (layer.feature.properties.RailFare__PeakTime).toFixed(2) + '</b> to ride to Union Station during peak hours.' + 
              '<hr style="height:0px; visibility:hidden;" />' +
            'Monthly expense: <br>' + 
            '• Peak: <b>$' + (40*layer.feature.properties.RailFare__PeakTime).toFixed(0) + '</b><br>' +
            '• Off-peak: <b>$' + (40*layer.feature.properties.RailFare__OffPeakTime).toFixed(0) + '</b>' 
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

var searchControl = L.esri.Geocoding.geosearch({position:'topleft'}).addTo(map);

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
