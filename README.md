IP-ADDRESS-TRACKER
https://ip-address-trackerfrj.netlify.app/

IP Address Tracker
The IP Address Tracker is a web application that shows you where any IP address or website is located on a map. When you visit the site, it automatically finds your current location based on your internet connection. You can also search for specific IP addresses like 8.8.8.8 or websites like google.com to see where their servers are located around the world. The application displays useful information including the exact IP address, city and region, timezone, and internet service provider. Everything is shown on an interactive map that you can zoom and pan around. I built this project to practice working with APIs and deployed it using Netlify so anyone can access it online.

What You Can Do With This App
• Automatic location detection - See your own location automatically when the page loads as the app detects where you are browsing from and shows it on the map with a custom marker • IP address search - Search for any IP address to see where that internet connection is coming from • Domain name lookup - Search for domain names like websites to see where their servers are hosted • Interactive mapping - The map is interactive so you can zoom in and out, drag around, and click on markers to see more details • Responsive design - The app works on phones, tablets, and computers since it adapts to different screen sizes.

How I Built This
• HTML5 - Used for structuring the webpage content and ensuring accessibility • CSS3 - Handles all the styling and makes sure the layout works on different devices with responsive design • JavaScript (ES6+) - Powers the interactive features and connects to external services using modern async/await patterns • Leaflet.js - Interactive mapping library I chose because it's free and works well for location visualization • IPify API - Third-party service for detecting user's public IP address automatically • Geo.ipify.org API - Converts IP addresses into geographic locations with detailed information • OpenStreetMap - Provides free map data and tiles for the visual map display • Netlify - Cloud platform I used for deployment and hosting to make the website available online.

Project Files
The main index.html file contains the webpage structure and layout. The styles.css file has all the design rules and responsive layout code. Inside the src folder, script.js contains the main application logic that handles user interactions and API calls. The secrets.js file stores the API key securely and stays out of version control. The images folder contains the site icon, search button arrow, and background patterns for mobile and desktop views.

ip-tracker/
*--index.html
*--styles.css
*--src/
    *script.js
    *secrets.js
*images/
    *favicon 32 x 32
    *icon-arrow.svg
    *pattern-bg-mobile.png
    *pattern-bg-desktop.png
*README.md

Getting Started
To run this project yourself you need a modern web browser and an API key from geo.ipify.org which provides the location data. You can sign up for a free account that gives you enough API calls for testing and learning. After getting your API key, you download the project files and create a secrets.js file in the src folder. You put your API key in that file using the format export const API_KEY = "your_key_here". Since browsers don't allow local file access for security reasons, you need to run a simple web server. You can use the Node.js development server by running npm run dev in the project folder, then visit localhost:3000 in your browser.

Keeping Your API Key Safe
Your API key is like a password that lets you access the location service, so you need to protect it. Never put your real API key directly in the main code files or upload it to GitHub where others can see it. Always keep it in the separate secrets.js file and add that file to your .gitignore so Git ignores it. For a live website, you'd use environment variables instead of a secrets file, but for learning this approach works fine. The free tier gives you 1000 API calls per month which is plenty for testing.

How to Use the Application
When you first load the page, it tries to detect your location automatically using your browser's location feature if you allow it. If that doesn't work, it falls back to using your IP address to estimate your location. To search for a specific location, you type an IP address or website name in the search box and either click the arrow button or press Enter. The map will update to show the new location with detailed information displayed below the search bar. You can click and drag the map to explore different areas or use the zoom controls to get a closer look.

Customizing the Look
The design uses CSS variables which make it easy to change colors and spacing. You can modify things like the main gray color, text sizes, and spacing between elements by changing the values at the top of the styles.css file. The map settings can be adjusted in the JavaScript file if you want to change the default zoom level or starting position. The custom marker that shows locations on the map can also be resized or restyled by modifying its CSS class.

How the APIs Work
The application connects to three different web services to get the information it needs. First, it uses ipify.org to detect what your current IP address is when you visit the page. Then it sends that IP address to geo.ipify.org which looks up the geographic location associated with that IP address and returns details like city, region, timezone, and internet provider. The map tiles that create the visual map come from OpenStreetMap which provides free geographic data that anyone can use.

Error Handling and User Experience
The application includes comprehensive error handling for common issues that users might encounter:
• Invalid or missing API keys - Clear error messages guide users to check their configuration • Network connection failures - Helpful messages when internet connectivity issues occur
• Invalid IP address or domain formats - User-friendly feedback for incorrectly formatted inputs • API rate limiting and service unavailability - Graceful handling when external services are down • Geolocation permission denials - Automatic fallback to IP-based location detection • Map initialization and rendering failures - Error recovery for mapping display issues.

Browser Requirements
This works in all modern browsers including Chrome, Firefox, Safari, and Edge. On mobile devices it works with iOS Safari, Chrome, and Samsung Internet. The code uses modern JavaScript features like async/await and ES6 modules, so very old browsers from several years ago might not support it. Most people won't have any issues since these features are widely supported now.

Deploying with Netlify
I chose Netlify for hosting because it makes deployment really simple and provides useful features for this type of project. You connect your GitHub repository to Netlify and it automatically builds and deploys your site whenever you push changes. Netlify provides HTTPS security by default which is required for location features to work properly. It also has a global content delivery network that makes the site load fast from anywhere in the world. For production use, Netlify lets you set environment variables securely so you don't have to put API keys in your code.

Legal Stuff
This project is for learning and demonstration purposes. The location data comes from external services that have their own terms of use, so if you build something similar for commercial use, make sure you understand their pricing and usage limits. OpenStreetMap data is free to use but requires attribution, which the app includes automatically.

Making Improvements
Some features I'd like to add in the future include support for IPv6 addresses, the ability to look up multiple addresses at once, a history of previous searches, and options to export the data. A dark mode toggle would improve the user experience, and adding offline functionality would make it work even without internet after the initial load.

Getting Help
If you run into problems, the browser's developer console usually shows helpful error messages. Make sure your API key is set up correctly in the secrets file and that you're running the project through a web server rather than opening the HTML file directly. Check that your internet connection is working and that the geo.ipify.org service is running normally. Most issues come from missing API keys or not using a local server for development.
________________________________________

Created as a learning project to practice modern web development techniques

****************************

Project Reflection:

The IP Address Tracker is a responsive web application that tracks IP addresses and domains, displaying detailed location information on an interactive map. This project combines multiple APIs and technologies to create something that solves real-world problems - you can automatically detect your current location or search for any IP address or domain to see where it's located geographically. The application provides comprehensive information, including the IP address, location details, timezone, and ISP information, all visualized on an interactive map with custom markers.

What Clicked for Me
The biggest breakthrough was understanding how asynchronous JavaScript works in practice. Reading about promises and async/await is one thing, but chaining API calls - first getting the user's IP, then fetching location data, then updating the map - made it click. I also got comfortable with ES6 modules, which initially seemed unnecessarily complex but now feel essential for organizing code properly.
Working with external APIs taught me that documentation isn't always perfect, and debugging network requests is crucial. The Leaflet mapping library was surprisingly intuitive once I understood the basic concepts of layers, markers, and coordinate systems. Learning to create responsive layouts using CSS Grid and implementing proper error handling strategies helped me understand what makes applications feel professional rather than just functional.

The Reality of Debugging and Getting Help
I spent way too much time on silly syntax errors. Missing brackets, typos in variable names, and forgetting to close functions. These weren't conceptual problems but pure carelessness that brought everything to a halt. Learning to use browser dev tools effectively and checking the console first became second nature.

When I hit walls,  my instructors Abraham E. Taverez and Colton Wright were invaluable in helping our cohort work through complex integration challenges. Their guidance on API key management and security practices felt like stepping into "real" development practices. Equally important was the support from my fellow classmates, whether they were helping debug tricky issues or just serving as a sounding board when I needed to vent frustration and regroup. That collaborative environment made tackling difficult problems feel manageable rather than overwhelming.

