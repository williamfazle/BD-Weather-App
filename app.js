const cityInput = document.getElementById('cityInput');
const cityOptions = document.getElementById('cityOptions');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');


// Bangladesh major cities for autocomplete
const cities = [
    "Dhaka", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barisal", "Rangpur",
    "Comilla", "Narayanganj", "Mymensingh", "Gazipur", "Jessore", "Cox's Bazar", "Bogura"
];

// Load city options into datalist
cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    cityOptions.appendChild(option);
});

// Button click
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (!city) {
        weatherCard.innerHTML = `<p>Please enter a city name.</p>`;
        return;
    }
    fetchForecast(city);
});

function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},BD&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            showForecast(data);
        })
        .catch(error => {
            weatherCard.innerHTML = `<p>${error.message}</p>`;
        });
}

function showForecast(data) {
    const cityName = data.city.name;
    const forecastList = data.list;
    let output = `<h2>${cityName}</h2>`;

    // Pick one forecast per day (every 24h = 8 * 3h blocks)
    for (let i = 0; i < forecastList.length; i += 8) {
        const item = forecastList[i];
        const date = new Date(item.dt_txt);
        output += `
      <div class="forecast-day">
        <h3>${date.toDateString()}</h3>
        <p><strong>Temperature:</strong> ${item.main.temp}°C</p>
        <p><strong>Condition:</strong> ${item.weather[0].main} (${item.weather[0].description})</p>
        <p><strong>Humidity:</strong> ${item.main.humidity}%</p>
        <p><strong>Wind:</strong> ${item.wind.speed} m/s</p>
      </div>
    `;
    }

    weatherCard.innerHTML = output;
}
