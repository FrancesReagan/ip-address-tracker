// config and imports//
// notes: this project uses an API key to access the IP geolocation services.//
// I will ensure that I have my API_KEY in secrets.js and correctly imported to protect from it being used
// by outside sources--so I can use all 1000 fetch and response not someone else//
// 


import { API_KEY } from "./secrets.js";

console.log(API_KEY);

// below is for testing locally and debugging---example IP addresses and domain class used to test the lookup
// functionality.
const TEST_IP_ADDRESS = "8.8.8.8"; // data from input--google's public DNS IP//
const TEST_DOMAIN = "www.perscholas.org";//perscholas's domain for testing
// const url = `https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}&ipAddress=${ipAddress}`

fetch(url)
.then(res => res.json())
.then(data => console.log(data))


// my Global Variables that need to be available and modifiable by any function in application
// throughout its repeated runs/lifecycle//

// this holds the leaflet map instance //
let map;  

//this holds the leaflet marker instance (for IP's location)//
let marker;

// Function to Initialize Map-----this function will set up the leaflet  map and the attempts to locate user//
  function initMap() {
    // initialize map on the "map" div//
    // the locate method is called instantly to get the user's true geo location position.//
    // and the setView:true will instantly zoom the map to the location found //
    // and the maxZoom: 16 sets max zoom level---and "L" is code marker reference
    // to the Leaflet library---open source JavaScript libary for maps--so L is leaflet's global
    // namespace object that contains all of its functions and classes---so L.marker is calling
    // leaflet's marker functin to create a map marker//
    map = L.map("map").locate({setView:true, maxZoom:16});

// add the base OpenStreetMap layer to map--this give the visual background for the map.//
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy;<ahref="http://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors'})
  .addTo(map);
  // add zoom control to map for better user interactions---and place on the bottom-rt//
  L.control.zoom({
    position:"bottomright" })
    .addTo(map);

    // custom marker icon---this uses leaflet divIcon to style the maker with pure CSS//
    const customIcon = L.divIcon({
      // this css class will be styled in styles.css//
      className: "custom-marker", 
      // width and height of icon marker//
      iconSize: [46,56],
      // this is point of icon that corresponds to the marker's location of bottom-center//
      iconAnchor: [23,56],

    });

    //initialize marker---place it at [0,0] initially as placeholder. Real position
    // will be updated dynamically when I or user fetches the IP location data.//
    marker = L.marker([0,0], {icon: customIcon})", {})

  })
})




  }


  // add references leaflet, Regex, geoipfiy, etc//
