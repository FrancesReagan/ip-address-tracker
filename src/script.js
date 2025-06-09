// addd my API_KEY in the script//

// config and imports//
// notes: project uses an API key to access the IP geolocation services.//
// need API_KEY in secrets.js and  import to protect from it being used
// by outside sources--so I can use all 1000 fetch and response ---not someone else//
// 


// --- For Local Testing & Debugging  ---
// example IP addresses and domains to test//
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

// my Global Variables//
// this holds the leaflet map instance //
let map = null

//this holds the leaflet marker instance (for IP's location)//
let marker = null;

// regex paterns//
const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;

// DOM elements//
  const searchInput = document.getElementById("search-input");
  const searchButton = document.getElementById("search-button");
  const ipDisplay = document.getElementById("ip-address");
  const locationDisplay = document.getElementById("location");
  const timezoneDisplay = document.getElementById("timezone");
  const ispDisplay = document.getElementById("isp");
  const loadingDisplay = document.getElementById("loading");
  const errorMsg = document.getElementById("error");

  // utility functions//
function showLoading() {
  if(loadingDisplay) loadingDisplay.style.display = "block";
}

function hideLoading() {
  if(loadingDisplay) loadingDisplay.style.display = "none";
}
// show error msg to user//
function showError(message){
  if(!errorMsg){
    console.error(message);
    return;
  }

  errorMsg.textContent = message;
  errorMsg.style.display = "block";

  // hide after 5 sec//
  setTimeout(() => {
    errorMsg.style.display = "none";
  },5000);
}

// fetch user's public IP address//
// @returns{Promise<string>}The user's IP address//
// @throws{Error}if the API call fails//

async function getUserIP() {
  try {
    console.log("Fetching user's public IP...");
    const response = await fetch("https://api.ipify.org?format=json");

    if(!response.ok) {
      throw new Error(`Failed to fetch IP: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.ip;
  }catch(error){
    console.error("Error fetching user IP:", error);
    throw new Error("Failed to get your public IP address. Check your network connection.");
  }
  }

  // updates UI with IP location data//
  // @param {Object}data - location data from geo.ipify API//
  function updateUI(data) {
    // Update text elements//
    ipDisplay.textContent = data.ip;
    locationDisplay.textContent = `${data.location.city}, ${data.location.region} ${data.location.postalCode || ""}`.trim();
    timezoneDisplay.textContent = `UTC ${data.location.timezone}`;
    ispDisplay.textContent = data.isp;


// update map//
const{lat,lng} = data.location;

if(!map){
  console.error("Map not initialized");
  return;
  }

  // set map view//
  map.setView([lat,lng],13);

  // update or create  marker//
  if(marker){
    marker.setLatLng([lat,lng]);
  } else {
// create custom marker icon//
    const customIcon = L.divIcon({
      className: "custom-marker",
      iconSize:[46,56],
      iconAnchor:[23,56], 
    });

    marker = L.marker([lat,lng], {icon: customIcon}).addTo(map);
  
  
  // add popup w/info//
  marker.bindPopup(`<b>${data.ip}</b><br>${data.location.city},${data.location.country}`).openPopup();
  }
}

  // fetch IP/Domain location data from geo.ipify API//
  // @param {string} query - IP address or domain to look up(empty for user's IP)//

  async function fetchLocationData(query=""){
    showLoading();

    try {
      // valdiate API key//
      if(!API_KEY || API_KEY === "YOUR_API_KEY_HERE" || API_KEY.length < 10){
        throw new Error("Invalid API key. Please check your secrets.js");
      }

      let url;

      if(query){
        // determine if IP or Domain//
       if(ipv4Regex.test(query)){
        url = ipAddress + query;
        console.log(`Fetching data for IP:${query}`);
       } else if(domainRegex.test(query)) {
        url = domainsEndpoint + query;
       console.log(`Fetching data for domain:${query}`);
       } else {
       throw new Error("Invalid IP address or domain format");
       }
      } else {
        // get user's IP first//
        const userIP = await getUserIP();
        url = ipAddress + userIP;
        console.log(`Fetching data from userIP:${userIP}`);
      }
      const response = await fetch(url);

      if(!response.ok){
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.messages || `API error:${response.status}`);
      }

      const data = await response.json();
      console.log("Location data received:",data);

      updateUI(data);

    } catch (error) {
      showError(error.message);
      console.error("Error fetching location data:",error);
    } finally {
      hideLoading();
    }
    }

    // initialize leaflet map//
    function initMap() {
      try {
        // initialize map with default view//
        map = L.map("map").setView([0,0],2);

        // add tile layer//
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
         maxZoom: 19,
         attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',}).addTo(map);

        //add zoom control//
        L.control.zoom({
          position:"bottomright"
        }).addTo(map);

        // try using browser geolocation//
        map.locate({setView:true, maxZoom:16});

        // geolocation success handling//
        map.on("locationfound",async (e) => {
          console.log("Browser location found:",e.latlng);

          // fetch IP data for ISP and other data detials anyway//
          await fetchLocationData();
        });

        // handle geolocation error//
        map.on("locationerror",async (e) => {
          console.log("Browser geolocation failed:", e.message);
          showError("Geolocation failed. Using IP-based location...");

          // fall back to IP-based location//
          await fetchLocationData();
        });
    } catch (error) {
      console.error("Error initializing map:", error);  
      showError("Failed to initialize map");
    }
  }
  // search functionality handling//
  async function handleSearch() {
   const query = searchInput.value.trim();

    if(!query) {
      showError("Please enter an IP address or domain to search");
      return;
    }
    await fetchLocationData(query);
    // clear search input on success//
    if(!errorMsg || errorMsg.style.display === "none") {
      searchInput.value = "";
    }
  }

// -----------event listeners--------------//
// initialize when DOM is ready//
document.addEventListener("DOMContentLoaded",() => {
  console.log("Initializing IP Tracker...");

  // initialize map (triggers first data fetch)//
  initMap();

  // search button click//
  searchButton.addEventListener("click", handleSearch);

  // search input enter key//
  searchInput.addEventListener("keypress", (event) => {
    if(event.key === "Enter") {
      handleSearch();
    }
  });
});
  
// -----export for testing in future-----//
// uncomment these if I want to test individual functions//
// export {getUserIP, fetchLocationData,updateUI};





  // add references leaflet, Regex, geoipfiy, etc//
