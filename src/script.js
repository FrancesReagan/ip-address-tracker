// addd my API_KEY in the script below when asked for it in function or method//

// config and imports//
// notes: this project uses an API key to access the IP geolocation services.//
// I will ensure that I have my API_KEY in secrets.js and correctly imported to protect from it being used
// by outside sources--so I can use all 1000 fetch and response not someone else//
// 


// --- For Local Testing & Debugging  ---
// These are example IP addresses and domains I can use to test the lookup
// functionality without needing to type them every time.
// const TEST_IP_ADDRESS = "8.8.8.8"; // Google's public DNS IP for testing
// const TEST_DOMAIN = "www.perscholas.org"; // Per Scholas's domain for testing



import { API_KEY } from "./secrets.js";
console.log(API_KEY);

// const url = `https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}&ipAddress=${ipAddress}`

// fetch(url)
// .then(res => res.json())
// .then(data => console.log(data))

// API endpoints//
const ipAddress = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=`;
const domainsEndpoint = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&domain=`;

// my Global Variables// // that need to be available and modifiable by any function in application throughout its repeated runs/lifecycle//
// this holds the leaflet map instance //
let map = null

//this holds the leaflet marker instance (for IP's location)//
let marker = null;

// regex paterns//
const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

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


    //update the map view and the marker's position based on the fetched location.//
    const lat = data.location.lat;
    const lng = data.location.lng;

    //set the  map view to the new coordinates.`13` chosen zoom level for city view.//
    map.setView([lat,lng], 13);

    //move existing marker to the new coordinates//
    marker.setLatLng([lat,lng]);

    //adding a popup to marker with basic information--optional//
    marker.bindPopup(`<b>${data.ip}</b><br>${data.location.city} ${data.location.country}`).openPopup();
    }

    // fetches the user's public IP address using the api.ipify.org service.//
    // @returns {Promises<string>} A promise that resolves with the user's IP address.//
    // @throws {Error} If the API call fails or returns an invalid response.//
    
    async function getUserIP() {
      try{
        console.log("Fetching user's public IP from api.ipify.org...");
        const ipResponse = await fetch("https://api.ipify.org?format=json");
        
        if(!ipResponse.ok) {
          // if the HTTP response status is not OK, throw an error.//
          throw new Error(`Failed to fetch user IP: ${ipResponse.status}
          ${ipResponse.statusText}`);
        }
          const ipData = await ipResponse.json();
          return ipData.ip;
      } catch (error) {
       console.error("Error in getUserIP function:", error);

       //re-throw a user-friendly error message.//
       throw new Error("Failed to get your public IP address. Check your network connection.");
      }
     }

    //  fetches ip geolocation from geo.ipify.org API.//
    // this function handles both inital load(user's IP) and search queries (specific IP/domain).//
    // @param {string} [query="] - the IP address or domain to search for. If empty 
    // it fetches the user's own IP data//
    // @throws {Error} if the API key is missing, or the API call fails.//

    async function fetchIPData(query = ") {
    //show loading indicator when data is being fetched.//
      showLoadiing();
      try {
          // ensure the API_KEY is  properly configured.//
      if (typeof API_KEY === "undefined" || API_KEY === "MY_API_KEY_HERE" || API_KEY.length < 5){
      // api key length check added for robustness//
        throw new Error("API key not found or invalid. Please ensure API_KEY is correctly set in secrets.js.");
      }
      
      let url = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;
      
      // determine if querying a specific IP/domain or the current user's IP.//

      if(query){
        // basic regex to distinguish between IP addresses and domains.//
        const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
        if(ipRegex.test(query)){
          url += `&ipAddress=${query}`;
          console.log(`Fetching data for IP:${query}`);
        } else {
          url += `&domain=${query}`;
          console.log(`Fetching data for domain: ${query}`);
        }
      } else {
        // if no query given, then fetch the current user's IP from another service and then use it for the geo.ipify.org lookup//
        // this path is important if map.locate()doesn't work of for initial page load.//
        console.log("No specific query provided. Attempting to fetch current user's IP.");
        // get public IP//
        const userIP = await getUserIP();
        url += `&ipAddress=${userIP}`;
      }
 
      // this is useful for debugging the API call//
      console.log(`Sending request to: ${url}`);
      const response = await fetch(url);
      
      if(!response.ok){
        // attempt to parse API-specific error messages.//
        // catch JSON parse errors//
        const errorData = await response.json().catch(() => ({})); 
        // prioritize API's message, then HTTP status message, then a common or generic fallback.//
        throw new Error(errorData.messages || `API call failed:${response.status} ${response.statusText}`||"Failed to fetch IP data.");
      }

      const data = await response.json();
      // log the full data for debugging//
      console.log("IPify API Response received:",data);
      // update the user interface with the new data.//
      updateUI(data);
      
    } catch (error) {
      // display user-friendly error message//
      showError(error.message);
      // log full error details for developer//
      console.error("Caught error in fetchIPData:",error);
    } finally {
      // hide loading indicator regardless of success or failure//
      hideLoading();
    }
    }
// application initialization on DOMContentLoaded//
// this ensures that the HTML content is fully loaded before my javascript tries to interact with it//
document.addEventListener("DOMContentLoaded", async () => {
  // initialize Leaflet map..this triggers geolocation process//
  initMap();
  // the first loading of user IP data is now moved by the initMap function's "locationfound" or "locationerror" event handlers. Therefore, I don't need
  // a direct `fetchIPData()` method here anymore//

  // search functionality setup----get references to my search input and button elements//
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");


  // add event listener for the search button click//
  searchButton.addEventListener("click", () => {
    // get and clean the input value//
    const query = searchInput.value.trim(); 
    // only search if there is input//
    if(query){
      fetchIPData(query);
    } else {
      // optional to give feedback if search input is empty//
      showError("Please enter an IP address or domain to search.");
    }
    });
  
    // add event listener for the "enter" key press in the search input//
    searchInput.addEventListener("keypress", (event) => {
      // check if the pressed key is the "enter" key//
      if(event.key==="Enter"){
        const query = searchInput.value.trim();
        if(query) {
          fetchIPData(query);
        } else {
          showError("Please enter an IP address or domain to search.");
        }
      }
    });

    // examples for manual testing---will keep commented out in production//
    // to test with Google's IP://
    // fetchIPData(TEST_IP_ADDRESS);

    // to test with a domain://
    // fetchIPData(TEST_DOMAIN);
  });






  // add references leaflet, Regex, geoipfiy, etc//
