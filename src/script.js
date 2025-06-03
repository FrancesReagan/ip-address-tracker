import { API_KEY } from "./secrets.js";

console.log(API_KEY);

const ipAddress = "8.8.8.8"; // data from input
const url = `https://geo.ipify.org/api/v2/country?apiKey=${API_KEY}&ipAddress=${ipAddress}`

fetch(url)
.then(res => res.json())
.then(data => console.log(data))
