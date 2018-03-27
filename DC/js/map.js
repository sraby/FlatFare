// BASEMAP

var map = L.map('mainmap', {
    scrollWheelZoom: false,
    minZoom: 8,
    maxZoom: 14
}).setView([38.907192, -77.036871], 11);

var basemap = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-background/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
}); 

basemap.addTo(map);

var roads = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-lines/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
}); 

roads.addTo(map);

var reference = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain-labels/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 12,
    maxZoom: 20,
    ext: 'png'
}); 

reference.addTo(map);

// SYMBOLOGY FUNCTIONS 

function getColor(d) {
        return  d == null? '#B3B4B6':
                d > 140000? '#b35806':
                d > 120000? '#e08214': 
                d > 100000? '#fdb863':
                d > 80000? '#fee0b6':
                d > 60000? '#d8daeb':
                d > 40000? '#b2abd2':
                d > 20000? '#8073ac':
                '#542788'; 
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
        return '#465451';
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
          fillColor: '#465451'
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

function highlightShape(e) {

    var layer = e.target;

    layer.setStyle({
        weight: 4,
        opacity: 0.9
    });
}

function resetShape(e) {
    income.resetStyle(e.target);
}

function onEachShape(feature, layer) {
    layer.on({
        mouseover: highlightShape,
        mouseout: resetShape
    });
} 

function pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, 
        {
            radius: getRadius(feature.properties.RailFare__PeakTime),
            color: "#465451",
            fillColor: setFill(feature.properties.RailFare__PeakTime),
            weight: 3,
            opacity: 1,
            fillOpacity: 1
        }
    );
}

function pointToLayerGray(feature, latlng) {
    return L.circleMarker(latlng, 
        {
            radius: 5,
            color: "#111",
            fillColor: "#111",
            weight: 3,
            opacity: 1,
            fillOpacity: 1
        }
    );
}

function styleLines(feature) {
    return {
    color: "#FC6150",
    weight: 7,
    opacity: 1,
    strokeOpacity: 1,
    };
}

function styleGray(feature) {
    return {
    color: "#111",
    weight: 4,
    opacity: 1,
    strokeOpacity: 1,
    };
}

function styleShapes(feature) {
    return {
    fillColor: getColor(feature.properties.MHI_2016),
    weight: 1,
    opacity: 0.7,
    color: "#FFF",
    fillOpacity: 0.7
    };
}

// MAP DATA

// Stations Field Names: 
//
// Name GIS_ID  WEB_URL ADDRESS LINE  Code  NameFull  RailFare__PeakTime  RailFare__OffPeakTime RailFare__SeniorDisabled  lon lat

lines = L.geoJson(linesWMATA, {
  style: styleLines
});

stations = L.geoJson(stationsWMATA, {
  pointToLayer: pointToLayer,
  onEachFeature: onEachFeature
});

income = L.geoJson(dcMHI, {
  style: styleShapes,
  onEachFeature: onEachShape
});

linesGray = L.geoJson(linesWMATA, {
    style: styleGray
});

stationsGray = L.geoJson(stationsWMATA, {
  pointToLayer: pointToLayerGray,
});


// POP UPS 

function numberWithCommas(x) {
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
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

income.bindTooltip(function (layer) {
    return L.Util.template('Census Tract ' + layer.feature.properties.NAME + ', ' + layer.feature.properties.COUNTY + '<br>' +
        '<em>Median Household Income: <b>$' + numberWithCommas(layer.feature.properties.MHI_2016) + '</b></em>');  
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

var transit = L.layerGroup([stations, lines]);
transit.addTo(map);

var people = L.layerGroup([income, stationsGray, linesGray]);

var baselayers = {
    "DC Metro": transit,
    "Median Income": people
};

var overlays = {
};

L.control.layers(baselayers, overlays, {position: 'topright', collapsed: false}).addTo(map);

map.on('baselayerchange', function(eventLayer) {
  if (eventLayer.name === 'Median Income') { 
     $("#legend-top").css("display","none");
     $("#legend-bottom").css("display","block"); // You should write a function to remove the previously shown control, or more simply all other legend controls (Leaflet will not trigger an erro if you try to remove something that is not there anyway)
  } 
  else {
     $("#legend-bottom").css("display","none");
     $("#legend-top").css("display","block");
  }
});

