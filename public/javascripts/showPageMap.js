mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
  center: campground.geometry.coordinates,
  zoom: 9, // starting zoom
});

new mapboxgl.Marker().setLngLat(campground.geometry.coordinates).addTo(map);
