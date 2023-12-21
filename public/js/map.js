mapboxgl.accessToken = mapToken;
mapboxgl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-supported/v0.2.0/mapbox-gl-supported.js'
);

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v12",
  center: coordinates,
  zoom: 5,
});
// console.log(coordinates);
const marker = new mapboxgl.Marker({ color: "red" })
  .setLngLat(coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML("<h4>located at here</h4>")
  )
  .addTo(map);
