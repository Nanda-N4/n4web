addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/' || path === '/index.html') {
        return new Response(getIndexHTML(), {
            headers: { 'Content-Type': 'text/html' },
        });
    } else if (path === '/search.html') {
        return new Response(getSearchHTML(), {
            headers: { 'Content-Type': 'text/html' },
        });
    } else if (path === '/styles.css') {
        return new Response(getStylesCSS(), {
            headers: { 'Content-Type': 'text/css' },
        });
    } else {
        return new Response('404 Not Found', { status: 404 });
    }
}

function getIndexHTML() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ip စစ်ပါ</title>
        <link rel="stylesheet" href="styles.css">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body>
        <div class="container">
            <div class="header">
                <a href="https://t.me/n4vpn" target="_blank" aria-label="N4 VPN Telegram">
                    <img src="https://n4vpnpro.x10.bz/n4logo.png" alt="N4 VPN Logo" class="logo">
                </a>
                <h1>သင့်ရဲ့ လက်ရှိ တည်နေရာ</h1>
            </div>

            <div class="info-box">
                <div class="info-item">
                    <span class="info-label">IP Address:</span>
                    <span class="info-value" id="ip"><span class="loading-dots"></span></span> 🌐
                </div>
                <div class="info-item">
                    <span class="info-label">Location:</span>
                    <span class="info-value" id="location"><span class="loading-dots"></span></span>
                    <span class="flag" id="location-flag"></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Country:</span>
                    <span class="info-value" id="country"><span class="loading-dots"></span></span>
                    <span class="flag" id="country-flag"></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Region:</span>
                    <span class="info-value" id="region"><span class="loading-dots"></span></span>
                    <span class="flag" id="region-flag"></span>
                </div>
                <div class="info-item">
                    <span class="info-label">City:</span>
                    <span class="info-value" id="city"><span class="loading-dots"></span></span>
                    <span class="flag" id="city-flag"></span>
                </div>
                <div class="info-item">
                    <span class="info-label">ISP:</span>
                    <span class="info-value" id="isp"><span class="loading-dots"></span></span> 💻
                </div>
                <div class="info-item">
                    <span class="info-label">Datacenter:</span>
                    <span class="info-value" id="datacenter"><span class="loading-dots"></span></span> 🖥️
                </div>
                <div class="info-item">
                    <span class="info-label">Map:</span>
                    <div id="map" class="map"><div class="map-loading"><span class="loading-dots"></span></div></div> 🗺️
                </div>
            </div>

            <div class="tabs">
                <button class="tab-button active" onclick="window.location.href='index.html'" aria-current="page">လက်ရှိ ip</button>
                <button class="tab-button" onclick="window.location.href='search.html'">ပြင်ပ ip စစ်ဆေးရန်</button>
            </div>
        </div>

        <div id="notification" class="notification hidden"></div>

        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
            // Global map variable
            let map;

            // Function to show notification
            function showNotification(message, isError = false) {
                const notification = document.getElementById('notification');
                notification.textContent = message;
                notification.className = isError ? 'notification error' : 'notification success';
                notification.classList.remove('hidden');
                
                setTimeout(() => {
                    notification.classList.add('hidden');
                }, 3000);
            }

            // Function to get flag emoji based on country code
            function getFlagEmoji(countryCode) {
                if (!countryCode) return '';
                const codePoints = countryCode
                    .toUpperCase()
                    .split('')
                    .map(char => 127397 + char.charCodeAt());
                return String.fromCodePoint(...codePoints);
            }

            // Function to show loading state
            function showLoading() {
                document.querySelectorAll('.info-value').forEach(el => {
                    if (!el.querySelector('.loading-dots')) {
                        el.innerHTML = '<span class="loading-dots"></span>';
                    }
                });
                document.getElementById('map').innerHTML = '<div class="map-loading"><span class="loading-dots"></span></div>';
            }

            // Function to fetch IP information
            async function fetchIPInfo(query = '') {
                showLoading();
                
                try {
                    const url = query ? \`https://ipinfo.io/\${query}/json?token=7bcd433fa867cf\` : 'https://ipinfo.io/json?token=7bcd433fa867cf';
                    const response = await fetch(url);
                    
                    if (!response.ok) {
                        throw new Error(\`API request failed with status \${response.status}\`);
                    }
                    
                    const data = await response.json();
                    
                    // Update UI with data
                    document.getElementById('ip').textContent = data.ip || 'N/A';
                    document.getElementById('location').textContent = data.loc || 'N/A';
                    document.getElementById('country').textContent = data.country || 'N/A';
                    document.getElementById('region').textContent = data.region || 'N/A';
                    document.getElementById('city').textContent = data.city || 'N/A';
                    document.getElementById('isp').textContent = data.org ? data.org.split(' ').slice(1).join(' ') : 'N/A';
                    document.getElementById('datacenter').textContent = data.hostname || 'Unknown';

                    // Add flag emojis
                    if (data.country) {
                        const countryFlag = getFlagEmoji(data.country);
                        document.getElementById('country-flag').textContent = countryFlag;
                        document.getElementById('location-flag').textContent = countryFlag;
                        document.getElementById('region-flag').textContent = countryFlag;
                        document.getElementById('city-flag').textContent = countryFlag;
                    }

                    // Show map
                    if (data.loc) {
                        const [lat, lon] = data.loc.split(',');
                        showMap(lat, lon);
                    } else {
                        document.getElementById('map').innerHTML = '<div class="map-placeholder">Map not available</div>';
                    }
                    
                } catch (error) {
                    console.error('Error fetching IP information:', error);
                    showNotification('Error loading IP information. Please try again.', true);
                    document.querySelectorAll('.info-value').forEach(el => {
                        el.textContent = 'Error';
                    });
                }
            }

            // Function to show map using OpenStreetMap and Leaflet.js
            function showMap(lat, lon) {
                const mapElement = document.getElementById('map');
                mapElement.innerHTML = ''; // Clear loading state
                
                // Initialize map if not already exists
                if (!map) {
                    map = L.map(mapElement).setView([lat, lon], 12);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap contributors',
                        maxZoom: 18
                    }).addTo(map);
                } else {
                    map.setView([lat, lon], 12);
                }
                
                // Clear existing markers and add new one
                map.eachLayer(layer => {
                    if (layer instanceof L.Marker) {
                        map.removeLayer(layer);
                    }
                });
                
                L.marker([lat, lon]).addTo(map)
                    .bindPopup(\`Location: \${lat}, \${lon}\`)
                    .openPopup();
            }

            // Fetch initial IP information on page load
            window.onload = function() {
                fetchIPInfo();
                
                // Add animation delays for info items
                document.querySelectorAll('.info-item').forEach((item, index) => {
                    item.style.animationDelay = \`\${index * 0.1}s\`;
                });
            };
        </script>
    </body>
    </html>
    `;
}

function getSearchHTML() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ပြင်ပ ip စစ်ဆေးခြင်း</title>
        <link rel="stylesheet" href="styles.css">
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    </head>
    <body>
        <div class="container">
            <div class="header">
                <a href="https://t.me/n4vpn" target="_blank" aria-label="N4 VPN Telegram">
                    <img src="https://n4vpnpro.x10.bz/image/n4logo.png" alt="N4 VPN Logo" class="logo">
                </a>
                <h1>သင်စစ်ဆေးလိုတဲ့ ip (or) hostname (or) Domain ထည့်ပါ</h1>
            </div>

            <div class="search-box">
                <input type="text" id="ip-search" placeholder="Enter IP, Domain, or Hostname" aria-label="Search IP or Domain">
                <button onclick="searchIP()" aria-label="Search">
                    <i class="fas fa-search"></i> Search
                </button>
            </div>

            <div class="info-box">
                <div class="info-item">
                    <span class="info-label">IP Address:</span>
                    <span class="info-value" id="ip"><span class="loading-dots"></span></span> 🌐
                </div>
                <div class="info-item">
                    <span class="info-label">Location:</span>
                    <span class="info-value" id="location"><span class="loading-dots"></span></span>
                    <span class="flag" id="location-flag"></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Country:</span>
                    <span class="info-value" id="country"><span class="loading-dots"></span></span>
                    <span class="flag" id="country-flag"></span>
                </div>
                <div class="info-item">
                    <span class="info-label">Region:</span>
                    <span class="info-value" id="region"><span class="loading-dots"></span></span>
                    <span class="flag" id="region-flag"></span>
                </div>
                <div class="info-item">
                    <span class="info-label">City:</span>
                    <span class="info-value" id="city"><span class="loading-dots"></span></span>
                    <span class="flag" id="city-flag"></span>
                </div>
                <div class="info-item">
                    <span class="info-label">ISP:</span>
                    <span class="info-value" id="isp"><span class="loading-dots"></span></span> 💻
                </div>
                <div class="info-item">
                    <span class="info-label">Datacenter:</span>
                    <span class="info-value" id="datacenter"><span class="loading-dots"></span></span> 🖥️
                </div>
                <div class="info-item">
                    <span class="info-label">Map:</span>
                    <div id="map" class="map"><div class="map-loading"><span class="loading-dots"></span></div></div> 🗺️
                </div>
            </div>

            <div class="tabs">
                <button class="tab-button" onclick="window.location.href='index.html'">လက်ရှိ ip</button>
                <button class="tab-button active" onclick="window.location.href='search.html'" aria-current="page">ပြင်ပ ip စစ်ဆေးရန်</button>
            </div>
        </div>

        <div id="notification" class="notification hidden"></div>

        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <script>
            // Global map variable
            let map;

            // Function to show notification
            function showNotification(message, isError = false) {
                const notification = document.getElementById('notification');
                notification.textContent = message;
                notification.className = isError ? 'notification error' : 'notification success';
                notification.classList.remove('hidden');
                
                setTimeout(() => {
                    notification.classList.add('hidden');
                }, 3000);
            }

            // Function to get flag emoji based on country code
            function getFlagEmoji(countryCode) {
                if (!countryCode) return '';
                const codePoints = countryCode
                    .toUpperCase()
                    .split('')
                    .map(char => 127397 + char.charCodeAt());
                return String.fromCodePoint(...codePoints);
            }

            // Function to show loading state
            function showLoading() {
                document.querySelectorAll('.info-value').forEach(el => {
                    if (!el.querySelector('.loading-dots')) {
                        el.innerHTML = '<span class="loading-dots"></span>';
                    }
                });
                document.getElementById('map').innerHTML = '<div class="map-loading"><span class="loading-dots"></span></div>';
            }

            // Function to resolve domain or hostname to IP
            async function resolveToIP(query) {
                try {
                    const response = await fetch(\`https://dns.google/resolve?name=\${query}&type=A\`);
                    
                    if (!response.ok) {
                        throw new Error(\`DNS resolution failed with status \${response.status}\`);
                    }
                    
                    const data = await response.json();
                    if (data.Answer && data.Answer.length > 0) {
                        return data.Answer[0].data; // Return the first IP address
                    } else {
                        throw new Error('Domain or hostname could not be resolved.');
                    }
                } catch (error) {
                    console.error('Error resolving domain:', error);
                    showNotification('Unable to resolve domain or hostname.', true);
                    return null;
                }
            }

            // Function to fetch IP information
            async function fetchIPInfo(query = '') {
                showLoading();
                
                try {
                    let ip = query;
                    
                    // Check if the query is a domain or hostname
                    if (!/^\d+\.\d+\.\d+\.\d+$/.test(query)) {
                        ip = await resolveToIP(query);
                        if (!ip) return;
                        
                        // Update search box with resolved IP
                        document.getElementById('ip-search').value = ip;
                    }

                    const url = \`https://ipinfo.io/\${ip}/json?token=7bcd433fa867cf\`;
                    const response = await fetch(url);
                    
                    if (!response.ok) {
                        throw new Error(\`IP info request failed with status \${response.status}\`);
                    }
                    
                    const data = await response.json();
                    
                    // Update UI with data
                    document.getElementById('ip').textContent = data.ip || 'N/A';
                    document.getElementById('location').textContent = data.loc || 'N/A';
                    document.getElementById('country').textContent = data.country || 'N/A';
                    document.getElementById('region').textContent = data.region || 'N/A';
                    document.getElementById('city').textContent = data.city || 'N/A';
                    document.getElementById('isp').textContent = data.org ? data.org.split(' ').slice(1).join(' ') : 'N/A';
                    document.getElementById('datacenter').textContent = data.hostname || 'Unknown';

                    // Add flag emojis
                    if (data.country) {
                        const countryFlag = getFlagEmoji(data.country);
                        document.getElementById('country-flag').textContent = countryFlag;
                        document.getElementById('location-flag').textContent = countryFlag;
                        document.getElementById('region-flag').textContent = countryFlag;
                        document.getElementById('city-flag').textContent = countryFlag;
                    }

                    // Show map
                    if (data.loc) {
                        const [lat, lon] = data.loc.split(',');
                        showMap(lat, lon);
                    } else {
                        document.getElementById('map').innerHTML = '<div class="map-placeholder">Map not available</div>';
                    }
                    
                    showNotification('IP information loaded successfully!');
                    
                } catch (error) {
                    console.error('Error fetching IP information