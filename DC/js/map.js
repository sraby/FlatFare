// BASEMAP

var map = L.map('mainmap', {
    scrollWheelZoom: false,
    maxZoom: 18
}).setView([40.716303, -73.940535], 11);

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
        return  d == 0 ? '#d73027':
                d < 0.50 ? '#fc8d59': 
                d < 1 ? '#fee08b':
                '#66bd63';
    }

function getBorder(d) {
        return d == 0 ? '#AC1A12':
            d < 0.50 ? '#E56D33':
            d < 1 ? '#D8B757':
            '#3F9C3A';
    }

function getRadius(d) {
        return d < 5 ? 3:
        d < 10 ? 4: 
        d < 20?   5:
        d < 50?   6:
        d < 100?   7:
        d < 200?   8:
        d < 400 ?   9:
        10;
    }

// INTERACTION

function highlightFeature(e) {

    var layer = e.target;

    layer.setStyle({
        fillOpacity: 1,
        opacity: 1
    });

    $(e.target.getElement()).attr('id', 'active');

    $('.leaflet-interactive').not('#active').not('.reference').css("fillOpacity","0.2").css("strokeOpacity","0.25");

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

}

function resetHighlight(e) {

    var layer = e.target;

    layer.setStyle({
        fillOpacity: 0.6,
        opacity: 0.6
    });

    $(e.target.getElement()).removeAttr("id");

    $('.leaflet-interactive').css("fill","").css("fillOpacity","").css("strokeOpacity","").css("strokeWidth","");
    
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
} 


function pointToLayer1(feature, latlng) {
    return L.circleMarker(latlng, 
        {
            radius: getRadius(feature.properties.All_Counted_Units),
            color: getBorder(feature.properties.Pct_1_person_affordable),
            fillColor: getColor(feature.properties.Pct_1_person_affordable),
            weight: 1,
            opacity: 0.6,
            fillOpacity: 0.6
        }
    );
}

function pointToLayer2(feature, latlng) {
    return L.circleMarker(latlng, 
        {
            radius: getRadius(feature.properties.All_Counted_Units),
            color: getBorder(feature.properties.Pct_2_person_affordable),
            fillColor: getColor(feature.properties.Pct_2_person_affordable),
            weight: 1,
            opacity: 0.6,
            fillOpacity: 0.6
        }
    );
}

function pointToLayer3(feature, latlng) {
    return L.circleMarker(latlng, 
        {
            radius: getRadius(feature.properties.All_Counted_Units),
            color: getBorder(feature.properties.Pct_3_person_affordable),
            fillColor: getColor(feature.properties.Pct_3_person_affordable),
            weight: 1,
            opacity: 0.6,
            fillOpacity: 0.6
        }
    );
}

function pointToLayer4(feature, latlng) {
    return L.circleMarker(latlng, 
        {
            radius: getRadius(feature.properties.All_Counted_Units),
            color: getBorder(feature.properties.Pct_4_person_affordable),
            fillColor: getColor(feature.properties.Pct_4_person_affordable),
            weight: 1,
            opacity: 0.6,
            fillOpacity: 0.6
        }
    );
}

function pointToLayer5(feature, latlng) {
    return L.circleMarker(latlng, 
        {
            radius: getRadius(feature.properties.All_Counted_Units),
            color: getBorder(feature.properties.Pct_5_person_affordable),
            fillColor: getColor(feature.properties.Pct_5_person_affordable),
            weight: 1,
            opacity: 0.6,
            fillOpacity: 0.6
        }
    );
}

// MAP DATA

// Field Names: 
// 
// Number   Street  Borough Latitude    Longitude   Extremely_Low_Income_Units  Very_Low_Income_Units   
// Low_Income_Units    Moderate_Income_Units   Middle_Income_Units Other   All_Counted_Units   Total_Units 
// LatLng_Copied_From_Internal pumaid  PUMA_disctrict  PUMA_borough    PUMA_name   MHI_1_person_households 
// MHI_2_person_households MHI_3_person_households MHI_4_person_households MHI_5_person_households 
// Highest_1_person_Afford Units_1_person_Afford   Pct_1_person_affordable Highest_2_person_Afford Units_2_person_Afford   
// Pct_2_person_affordable Highest_3_person_Afford Units_3_person_Afford   Pct_3_person_affordable Highest_4_person_Afford 
// Units_4_person_Afford   Pct_4_person_affordable Highest_5_person_Afford Units_5_person_Afford   Pct_5_person_affordable                         

HNY1 = L.geoJson(HNYdata, {
    pointToLayer: pointToLayer1,
    onEachFeature: onEachFeature
}).addTo(map);

HNY2 = L.geoJson(HNYdata, {
    pointToLayer: pointToLayer2,
    onEachFeature: onEachFeature
});

HNY3 = L.geoJson(HNYdata, {
    pointToLayer: pointToLayer3,
    onEachFeature: onEachFeature
});

HNY4 = L.geoJson(HNYdata, {
    pointToLayer: pointToLayer4,
    onEachFeature: onEachFeature
});

HNY5 = L.geoJson(HNYdata, {
    pointToLayer: pointToLayer5,
    onEachFeature: onEachFeature
});

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

HNY1.bindPopup(function (layer) {
    return L.Util.template('<h2>' + layer.feature.properties.Number + ' ' + toTitleCase(layer.feature.properties.Street) + ', ' + layer.feature.properties.Borough + '</h2>' +
            'This building in ' + layer.feature.properties.PUMA_name + ' has <b>' + layer.feature.properties.All_Counted_Units + ' ' + unitUnits(layer.feature.properties.All_Counted_Units) + '</b> (out of ' + layer.feature.properties.Total_Units +') counting towards the Housing New York plan. ' +
            '<table>' + 
              '<tr><th>Income Range</th><th># of Units</th></tr>' +
              '<tr><td>$0—$19,050</td><td>' + layer.feature.properties.Extremely_Low_Income_Units + '</td></tr>' + 
              '<tr><td>$19,051—$31,750</td><td>' + layer.feature.properties.Very_Low_Income_Units + '</td></tr>' +
              '<tr><td>$31,751—$50,750</td><td>' + layer.feature.properties.Low_Income_Units + '</td></tr>' +
              '<tr><td>$50,751—$76,200</td><td>' + layer.feature.properties.Moderate_Income_Units + '</td></tr>' +
              '<tr><td>$76,201—$104,775</td><td>' + layer.feature.properties.Middle_Income_Units + '</td></tr>' +
              '<tr class="no-border"><td><q>other</q> units</td><td>' + layer.feature.properties.Other + '</td></tr>' +
              '</table>' +
              'A typical (median-income) <b>one-person household</b> in this district makes <b>$' + numberWithCommas(layer.feature.properties.MHI_1_person_households) + ' a year</b> and can afford about <b>' + Math.floor(layer.feature.properties.Pct_1_person_affordable*1000)/10 + '%</b> of the units in this building.');
        });

HNY2.bindPopup(function (layer) {
    return L.Util.template('<h2>' + layer.feature.properties.Number + ' ' + toTitleCase(layer.feature.properties.Street) + ', ' + layer.feature.properties.Borough + '</h2>' +
            'This building in ' + layer.feature.properties.PUMA_name + ' has <b>' + layer.feature.properties.All_Counted_Units + ' ' + unitUnits(layer.feature.properties.All_Counted_Units) + '</b> (out of ' + layer.feature.properties.Total_Units +') counting towards the Housing New York plan. ' +
            '<table>' + 
              '<tr><th>Income Range</th><th># of Units</th></tr>' +
              '<tr><td>$0—$21,800</td><td>' + layer.feature.properties.Extremely_Low_Income_Units + '</td></tr>' + 
              '<tr><td>$21,801—$36,250</td><td>' + layer.feature.properties.Very_Low_Income_Units + '</td></tr>' +
              '<tr><td>$36,251—$58,000</td><td>' + layer.feature.properties.Low_Income_Units + '</td></tr>' +
              '<tr><td>$58,001—$87,000</td><td>' + layer.feature.properties.Moderate_Income_Units + '</td></tr>' +
              '<tr><td>$87,001—$119,625</td><td>' + layer.feature.properties.Middle_Income_Units + '</td></tr>' +
              '<tr class="no-border"><td><q>other</q> units</td><td>' + layer.feature.properties.Other + '</td></tr>' +
              '</table>' +
              'A typical (median-income) <b>two-person household</b> in this district makes <b>$' + numberWithCommas(layer.feature.properties.MHI_2_person_households) + ' a year</b> and can afford about <b>' + Math.floor(layer.feature.properties.Pct_2_person_affordable*1000)/10 + '%</b> of the units in this building.');
        });

HNY3.bindPopup(function (layer) {
    return L.Util.template('<h2>' + layer.feature.properties.Number + ' ' + toTitleCase(layer.feature.properties.Street) + ', ' + layer.feature.properties.Borough + '</h2>' +
            'This building in ' + layer.feature.properties.PUMA_name + ' has <b>' + layer.feature.properties.All_Counted_Units + ' ' + unitUnits(layer.feature.properties.All_Counted_Units) + '</b> (out of ' + layer.feature.properties.Total_Units +') counting towards the Housing New York plan. ' +
            '<table>' + 
              '<tr><th>Income Range</th><th># of Units</th></tr>' +
              '<tr><td>$0—$24,500</td><td>' + layer.feature.properties.Extremely_Low_Income_Units + '</td></tr>' + 
              '<tr><td>$24,501—$40,800</td><td>' + layer.feature.properties.Very_Low_Income_Units + '</td></tr>' +
              '<tr><td>$40,801—$65,250</td><td>' + layer.feature.properties.Low_Income_Units + '</td></tr>' +
              '<tr><td>$65,251—$97,920</td><td>' + layer.feature.properties.Moderate_Income_Units + '</td></tr>' +
              '<tr><td>$97,921—$134,640</td><td>' + layer.feature.properties.Middle_Income_Units + '</td></tr>' +
              '<tr class="no-border"><td><q>other</q> units</td><td>' + layer.feature.properties.Other + '</td></tr>' +
              '</table>' +
              'A typical (median-income) <b>three-person household</b> in this district makes <b>$' + numberWithCommas(layer.feature.properties.MHI_3_person_households) + ' a year</b> and can afford about <b>' + Math.floor(layer.feature.properties.Pct_3_person_affordable*1000)/10 + '%</b> of the units in this building.');
        });

HNY4.bindPopup(function (layer) {
    return L.Util.template('<h2>' + layer.feature.properties.Number + ' ' + toTitleCase(layer.feature.properties.Street) + ', ' + layer.feature.properties.Borough + '</h2>' +
            'This building in ' + layer.feature.properties.PUMA_name + ' has <b>' + layer.feature.properties.All_Counted_Units + ' ' + unitUnits(layer.feature.properties.All_Counted_Units) + '</b> (out of ' + layer.feature.properties.Total_Units +') counting towards the Housing New York plan. ' +
            '<table>' + 
              '<tr><th>Income Range</th><th># of Units</th></tr>' +
              '<tr><td>$0—$27,200</td><td>' + layer.feature.properties.Extremely_Low_Income_Units + '</td></tr>' + 
              '<tr><td>$27,201—$45,300</td><td>' + layer.feature.properties.Very_Low_Income_Units + '</td></tr>' +
              '<tr><td>$45,301—$72,500</td><td>' + layer.feature.properties.Low_Income_Units + '</td></tr>' +
              '<tr><td>$72,501—$108,720</td><td>' + layer.feature.properties.Moderate_Income_Units + '</td></tr>' +
              '<tr><td>$108,721—$149,490</td><td>' + layer.feature.properties.Middle_Income_Units + '</td></tr>' +
              '<tr class="no-border"><td><q>other</q> units</td><td>' + layer.feature.properties.Other + '</td></tr>' +
              '</table>' +
              'A typical (median-income) <b>four-person household</b> in this district makes <b>$' + numberWithCommas(layer.feature.properties.MHI_4_person_households) + ' a year</b> and can afford about <b>' + Math.floor(layer.feature.properties.Pct_4_person_affordable*1000)/10 + '%</b> of the units in this building.');
        });

HNY5.bindPopup(function (layer) {
    return L.Util.template('<h2>' + layer.feature.properties.Number + ' ' + toTitleCase(layer.feature.properties.Street) + ', ' + layer.feature.properties.Borough + '</h2>' +
            'This building in ' + layer.feature.properties.PUMA_name + ' has <b>' + layer.feature.properties.All_Counted_Units + ' ' + unitUnits(layer.feature.properties.All_Counted_Units) + '</b> (out of ' + layer.feature.properties.Total_Units +') counting towards the Housing New York plan. ' +
            '<table>' + 
              '<tr><th>Income Range</th><th># of Units</th></tr>' +
              '<tr><td>$0—$29,400</td><td>' + layer.feature.properties.Extremely_Low_Income_Units + '</td></tr>' + 
              '<tr><td>$29,401—$48,950</td><td>' + layer.feature.properties.Very_Low_Income_Units + '</td></tr>' +
              '<tr><td>$48,951—$78,300</td><td>' + layer.feature.properties.Low_Income_Units + '</td></tr>' +
              '<tr><td>$78,301—$117,480</td><td>' + layer.feature.properties.Moderate_Income_Units + '</td></tr>' +
              '<tr><td>$117,481—$161,535</td><td>' + layer.feature.properties.Middle_Income_Units + '</td></tr>' +
              '<tr class="no-border"><td><q>other</q> units</td><td>' + layer.feature.properties.Other + '</td></tr>' +
              '</table>' +
              'A typical (median-income) <b>five-person household</b> in this district makes <b>$' + numberWithCommas(layer.feature.properties.MHI_5_person_households) + ' a year</b> and can afford about <b>' + Math.floor(layer.feature.properties.Pct_5_person_affordable*1000)/10 + '%</b> of the units in this building.');
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

// COMMUNITY DISTRICTS DATA

var reference = map.createPane('reference'); 

map.getPane('reference').style.zIndex = 250;

function commStyle(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: '#222',
        fillColor: 'rgba(0,0,0,0)',
        //dashArray: 4,
        pane: reference 
    };
}

var community_districts = L.geoJson(commDistricts, {
    style: commStyle,
    interactive: false
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
    "One-person households": HNY1,
    "Two-person households": HNY2,
    "Three-person households": HNY3,
    "Four-person households": HNY4,
    "Five-person households": HNY5
};

var overlays = {
    "Community Districts (PUMA)":community_districts
};

L.control.layers(baselayers, overlays, {position: 'topright', collapsed: true}).addTo(map);
