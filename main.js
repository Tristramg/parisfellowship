(function () {
    var map = L.map('map',{
        scrollWheelZoom: 'center',
        center: [48.829606,  2.376093],
        zoom: 17,
        boxZoom: false,
        keyboard: false
    });

    var layer = Tangram.leafletLayer({
        scene: 'style.yaml',
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    }).addTo(map);

    window.scene = layer.scene;
    var hash = new L.Hash(map);

    map.on('drag', onMouseDrag);
    document.addEventListener('keydown', onKeyDown, false);

    window.map = map;

    var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    var osmAttrib='Map data &copy; OpenStreetMap contributors';
    var osm = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 13, attribution: osmAttrib });
    var miniMap = new L.Control.MiniMap(osm, { toggleDisplay: true }).addTo(map);
}());

function onMouseDrag (ev) {
    e = ev.originalEvent;

    if (e.which == 2) {
        scene.styles.tilt.shaders.uniforms.u_tilt_x -= e.movementY / 400.0;
        scene.styles.tilt.shaders.uniforms.u_tilt_z -= e.movementX / 200.0;
    }
}

function onKeyDown (event) {
    const keyName = event.key;

    if(!event.shiftKey && !event.altKey && !event.ctrlKey) {
        var angle = scene.styles.tilt.shaders.uniforms.u_tilt_z;
        var dx = Math.sin(angle) * 80;
        var dy = Math.cos(angle) * 80;
        switch(keyName) {
            case 'ArrowUp':
                map.panBy([-dx, -dy]);
                break;
            case 'ArrowDown':
                map.panBy([dx, dy]);
                break;
            case 'ArrowLeft':
                map.panBy([-dy, dx]);
                break;
            case 'ArrowRight':
                map.panBy([dy, -dx]);
                break;
        }
    } else if (event.shiftKey && !event.altKey && !event.ctrlKey) {
        switch(keyName) {
            case 'ArrowUp':
                scene.styles.tilt.shaders.uniforms.u_tilt_x -= 0.1;
                break;
            case 'ArrowDown':
                scene.styles.tilt.shaders.uniforms.u_tilt_x += 0.1;
                break;
            case 'ArrowLeft':
                scene.styles.tilt.shaders.uniforms.u_tilt_z -= 0.1;
                break;
            case 'ArrowRight':
                scene.styles.tilt.shaders.uniforms.u_tilt_z += 0.1;
                break;
        }
        scene.requestRedraw();
    }
};
