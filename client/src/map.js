var layer = new L.StamenTileLayer("terrain");
var map = new L.Map("discoverablemap", {
    center: new L.LatLng(52.1026406, 5.175044799999999),
    zoom: 8
});
map.addLayer(layer);

async function fetchAndParseDataFromServer() {

    try{
        let fetchResponse = await fetch("/api/attractions");
        const fetchResponseJSON = await fetchResponse.json();
        return fetchResponseJSON;

    } catch (e) {
        console.error(e);
    }

}

async function printMarkersOnMap() {

    let serverFetchedData = await fetchAndParseDataFromServer();

    if (serverFetchedData) {

        for (i = 0; i < serverFetchedData.length; i++ ) {
            let attraction = serverFetchedData[i];
            mountAndAddMarkersToMap(attraction);
        }
    }

}

function mountAndAddMarkersToMap(attraction) {
    let attractionMarker = L.marker(attraction.location, {
        title: attraction.name
    }).addTo(map);
}



// Marker added for example sake. Lat en longs need to be picked up from api/attraction for each marker
//var marker = L.marker([51.649718 ,5.043689], {title: "parkname"}).addTo(map).bindPopup("<b>ParkName</b><br>ParkDescription</br>");
printMarkersOnMap();