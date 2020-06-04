var layer = new L.StamenTileLayer("terrain");
var map = new L.Map("discoverablemap", {
    center: new L.LatLng(52.1026406, 5.175044799999999),
    zoom: 8
});
map.addLayer(layer);

// Marker added for example sake. Lat en longs need to be picked up from api/attraction for each marker
var marker = L.marker([51.649718 ,5.043689]).addTo(map);
