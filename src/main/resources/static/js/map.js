$(function () {

    function createObj(position) {

        var thing = new ol.geom.Point([position.lat, position.lon]);

        var featurething = new ol.Feature({
            name: "Thing",
            geometry: thing
        });

        return featurething;
    }

    $("#gong").on('click', function (e) {
        e.preventDefault();
        $.get("getdrone", null, function (data) {
            $("#drone_list").append("<div class=\"list_item\">" + data.id + "</div>");
            vectorSource.addFeature(createObj(data.position));
            map.render();
        })
    })

    var image = new ol.style.Circle({
        radius: 25,
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
        }),
        stroke: new ol.style.Stroke({color: 'red', width: 1})
    });

    var styles = {
        'Point': new ol.style.Style({
            image: image
        }),
        'Polygon': new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'blue',
                lineDash: [4],
                width: 3
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 255, 0.1)'
            })
        })
    };

    var styleFunction = function (feature) {
        return styles[feature.getGeometry().getType()];
    };

    var geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
            'type': 'name',
            'properties': {
                'name': 'EPSG:3857'
            }
        },
        'features': [{
            'type': 'Feature',
            'geometry': {
                'type': 'Polygon',
                'coordinates': [[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]
            }
        }, {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [-6e6, -4e6]
            }
        }]
    };

    var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });


    var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: styleFunction
    });


    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),
            vectorLayer
        ],
        target: 'map',
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        view: new ol.View({
            center: [0, 0],
            zoom: 2
        })
    });

    <!-- hare animation starts -->
    var imageStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            snapToPixel: false,
            fill: new ol.style.Fill({color: 'yellow'}),
            stroke: new ol.style.Stroke({color: 'red', width: 1})
        })
    });

    var headInnerImageStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 2,
            snapToPixel: false,
            fill: new ol.style.Fill({color: 'blue'})
        })
    });

    var headOuterImageStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            snapToPixel: false,
            fill: new ol.style.Fill({color: 'black'})
        })
    });

    var n = 2;
    var omegaTheta = 30000; // Rotation period in ms
    var R = 7e6;
    var r = 2e6;
    var p = 2e6;
    map.on('postcompose', function (event) {
        var vectorContext = event.vectorContext;
        var frameState = event.frameState;
        var theta = 2 * Math.PI * frameState.time / omegaTheta;
        var coordinates = [];
        var i;
        for (i = 0; i < n; ++i) {
            var t = theta + 2 * Math.PI * i / n;
            var x = (R + r) * Math.cos(t) + p * Math.cos((R + r) * t / r);
            var y = (R + r) * Math.sin(t) + p * Math.sin((R + r) * t / r);
            coordinates.push([x, y]);
        }
        vectorContext.setStyle(imageStyle);
        vectorContext.drawGeometry(new ol.geom.MultiPoint(coordinates));

        var headPoint = new ol.geom.Point(coordinates[coordinates.length - 1]);

        vectorContext.setStyle(headOuterImageStyle);
        vectorContext.drawGeometry(headPoint);

        vectorContext.setStyle(headInnerImageStyle);
        vectorContext.drawGeometry(headPoint);

        map.render();
    });
    map.render();
});