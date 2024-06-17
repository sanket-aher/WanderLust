// console.log(JSON.parse(coordinates));

// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: JSON.parse(coordinates), // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker1 = new mapboxgl.Marker({ color:'red' })
    .setLngLat(JSON.parse(coordinates)) //listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${Listingtitle}</h4><p>Exact location will be provided after booking</p>`)
    )
    .addTo(map);