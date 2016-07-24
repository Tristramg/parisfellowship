(function () {
    var map = L.map('map',{
        scrollWheelZoom: 'center',
        center: [48.829606,  2.376093],
        zoom: 17,
        boxZoom: false
    });

    var layer = Tangram.leafletLayer({
        scene: 'style.yaml',
        attribution: '<a href="https://mapzen.com/tangram" target="_blank">Tangram</a> | &copy; OSM contributors | <a href="https://mapzen.com/" target="_blank">Mapzen</a>'
    }).addTo(map);

    window.scene = layer.scene;
    var hash = new L.Hash(map);

    map.on('drag', onMouseDrag)
}());

function onMouseDrag (ev) {
    e = ev.originalEvent;

    if (e.which == 2) {
        scene.styles.tilt.shaders.uniforms.u_tilt_x -= e.movementY / 400.0;
        scene.styles.tilt.shaders.uniforms.u_tilt_z -= e.movementX / 200.0;
    }
}
