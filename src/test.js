
// import { API_KEY } from "./secrets.js";

// // console.log(API_KEY);

// const ipAddress = "8.8.8.8"; // google's ip address for testing
// const domain = "www.perscholas.org"; // perscholas's domain for testing

// const ipAddressEndpoint = `https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}&ipAddress=${ipAddress}`
// const domainsEndpoint = `https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}&domain=${domain}`;

// document.addEventListener("DOMContentLoaded", async () => {
//   try {
//     // get the user ip address
//     const ipResponse = await fetch("https://api.ipify.org?format=json");
//     const ipData = await ipResponse.json();
//     const ip = ipData.ip;

//     // get location info
//     const locationResponse = await fetch(`https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}&ipAddress=${ip}`);
//     const locationData = await locationResponse.json();
    
//     console.log(locationData);
//   } catch (error) {
//     console.error("Error fetching IP address:", error);
//   }
// });