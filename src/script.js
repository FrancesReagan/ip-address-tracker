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
    marker = L.marker([0,0], {icon: customIcon}).addTo(map);

   // leaflet geolocation event handlers--they react to outcomes of map.locate() call.//
   // event:"locationfound" will happen when the browser successfully find's user's location//
    map.on("locationfound", async(event) => {

    // log coordinates found by leaflet's geolocation//
    console.log("Leaflet: User location found",e.latlng);
    // though leaflet has lat/lng---will also need public IP to query geo.ipify.org for ISP, timezone, etc//

// ----check this area

    //shared fallback function--check this again---could refactor so both locationfound and locationerror share same fallback//
    async function handleIPFallback(context = "location process") {
      try {
        //get the public IP//
        const userIP = await getUserIP();
        console.log(`${context}: User's public IP identified as ${userIP}`);
        //fetch all data using public IP//
        await fetchIPData(userIP);
      } catch{error} {
        //if fallback IP fetching fails--show generic error//
        console.error(`Error during ${context}:`, error);
        showError(`Couldn't retrieve detailed data for your IP during ${context}.`);
        //final fallback--can load default location or just leave the map at its initial view//
        //show global view if nothing works//
        map.setView([0,0],2);
      }
      }

      map.on("locationfound", async(event) => {
        try{
          await handleIPFallback("locationfound process");
        } catch(error) {
          // handle if needed//
        }
        });

        map.on("locationerror", async(event) => {
          console.error("Leaflet: Geolocation error:", event.message);
          showError(`Geolocation failed: "${event.message}". Falling back to IP-based location...`);
          await handleIPFallback("locationerror fallback");
        });

     
      // Utility functions---these help manage UI fdbk and data presentation.//
      // displays the loading indicator//
      function showLoading() {
        //easy way to show the loading state to a user//
        document.getElementById("loading").style.display = "block";
      }

      //to hide the loading indicator.//
      function hideLoading() {
        document.getElementById("loading").style.display = "none";  
      }

      // to display a temporary error message to user//
      // @param {string} message - the error message to display//
      function showError(message) {
        const errorEl = document.getElementById("error");
        errorEl.textContent = message;
        errorEl.style.display = "block";
      }
      //automatically hides the error message after 5 seconds--so looks like to user//
      setTimeout(() => {
        errorEl.style.display = "none";
      }, 5000);
    }
  
    // to update the HTML elements with fetched IP data//
    // @param{object} data - The IP data object returned by geo.ipify.org.//
    function updateUI(data){
      //populate the info box(es) with data.//
      //use optional chaining (`||"`) for postalCode to prevent "null" or "undefinied" from showing.//
      document.getElementById("ipAddress").textContent = data.ip;
      document.getElementById("location").textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode ||"}`.trim();
    
        // Timezone needs the UTC offset prefix --as design requested.//
        document.getElementById("timezone").textContent = `UTC ${data.location.timezone}`;
        document.getElementById("isp").textContent = data.isp;

        
    
      }


  // add references leaflet, Regex, geoipfiy, etc//
