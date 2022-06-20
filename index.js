(function (window) {
    'use strict';

    function initMap() {
        var control;
        var L = window.L;

        var google = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', 
            { zIndex: 50, opacity: 1, maxZoom: 24, subdomains: ["mt0", "mt1", "mt2", "mt3"],
            attribution: 'Google Satellite'
            });
        
        var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        });
    
        var baseMaps = {
            "Google satellite": google,
            "OSM":osm
        };

        var map = L.map('map', {
            center: [48.5538231,1.9302962],
            zoom: 12
        }).addLayer(osm);

        var layerControl = L.control.layers(baseMaps).addTo(map);

        function get_random_color() 
        {
        var color = "";
        for(var i = 0; i < 3; i++) {
            var sub = Math.floor(Math.random() * 256).toString(16);
            color += (sub.length == 1 ? "0" + sub : sub);
        }
        return "#" + color;
        }

        
        var style = {
            color: 'red',
            opacity: 1.0,
            fillOpacity: 0.2,
            weight: 1,
            clickable: true
        };

        L.Control.FileLayerLoad.LABEL = '<img class="icon" src="folder.svg" alt="file icon"/>';
        
        control = L.Control.fileLayerLoad({
            fitBounds: true,
            fileSizeLimit: 150000,
            layerOptions: {
                style: style,
                onEachFeature: function (feature,layer){
                    control.loader.on('data:loaded',function (e) {
                        console.log (e.filename);
                    let featureProperties = feature.properties;
                    let popupHtml = `<h2>${e.filename}</h2>`;
                    for(let property in featureProperties) {
                        popupHtml+=`<b>${property}:</b> ${featureProperties[property]}<br>`
                        }
                        layer.bindPopup(L.popup({maxHeight: 225}).setContent(popupHtml))
                })},

                pointToLayer: function (data, latlng) {
                    return L.circleMarker(
                        latlng,
                        { style: style },

                    );

                }
            }
        });

        control.addTo(map);
        

        control.loader.on('data:loaded',function (event) {
            // Randomise color on load layer to map
            style.color = get_random_color();
            // var layer = e.layer;
            console.log(event.filename);
            layerControl.addOverlay(event.layer, event.filename);
        });

        control.loader.on('data:error', function (error) {
            // Do something usefull with the error!
            console.warn("This data can't be load");
        });
    }

    window.addEventListener('load', function () {
        initMap();
    });
    




    
    

    
}(window));
