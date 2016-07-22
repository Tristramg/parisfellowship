// Author: @patriciogv 2015

// ============================================= VARIABLES
//
var clientX, clientY, clicked = false;
// ============================================= INIT 
map = (function () {
    'use strict';

    // Leaflet Map
    var map = L.map('map',{ 
        trackResize: true,
        keyboard: false,
        maxZoom: 19.5,
        dragging: (window.self !== window.top && L.Browser.touch) ? false : true,
        tap: (window.self !== window.top && L.Browser.touch) ? false : true,
        scrollWheelZoom: 'center', 
        zoomControl: false 
    });

    // Tangram Layer
    var layer = Tangram.leafletLayer({
        scene: 'style.yaml',
        attribution: '<a href="https://twitter.com/patriciogv" target="_blank">@patriciogv</a> | <a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    });

    window.layer = layer;
    var scene = layer.scene;
    window.scene = scene;

    map.setView([48.829606,  2.376093], 17);
//    var hash = new L.Hash(map);

    /***** Render loop *****/
    window.addEventListener('load', function () {
        init();
    });

    return map;
}());

function init () {
    layer.addTo(map);

    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mousemove', onMouseUpdate, false);
    document.addEventListener('mouseup', onMouseUp, false);
}


// ============================================= EVENT
function onMouseUpdate (e) {
    if(clicked && e.button == 1) {
      var dx = (e.clientX - clientX) || 0;
      var dy = (e.clientY - clientY) || 0;

      scene.styles.tilt.shaders.uniforms.u_tilt_x += dy / 200.0;
      scene.styles.tilt.shaders.uniforms.u_tilt_z += dx / 100.0;

      clientX = e.clientX;
      clientY = e.clientY;
    }
}

function onMouseDown(e) {
    if(e.button == 1) {
      clicked = true;
      clientX = e.clientX;
      clientY = e.clientY;
    }
}

function onMouseUp(e) {
    if(e.button == 1) {
      clicked = false;
    }
}
