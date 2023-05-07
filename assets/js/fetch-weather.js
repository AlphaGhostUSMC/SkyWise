// Set API endpoint
const endpoint = "https://api.openweathermap.org/data/2.5/weather";

// Set API key
const apiKey = "1d4298744e7a95525f475935e6ec25db";

// Get the search input element
const searchInput = document.querySelector("#location-search-input");

// Get the weather data based on the search input
async function getWeatherData() {
  try {
    // Construct the API URL with the search input and API key
    const url = `${endpoint}?q=${searchInput.value}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    // Display weather data in the UI
    displayWeather(data);
  } catch (error) {
    console.error(error);
  }
}

// Update the weather data when the search form is submitted
const searchForm = document.querySelector(".get-weather");
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  getWeatherData();
});

// Update the weather data when the page loads
window.addEventListener("load", () => {
  getWeatherData();
});

function displayWeather(data) {
  const { name, main, wind, weather} = data;
  const descriptionMain = document.querySelector(".temp-description"); 
  const cityMain = document.querySelector(".city-main");
  const tempMain = document.querySelector(".temp-main");
  const humidityMain = document.querySelector(".humidity-main");
  const windMain = document.querySelector(".wind-main");
  const weatherIconMain = document.querySelector(".weather-icon-main");

  
  cityMain.textContent = name;
  tempMain.textContent = `${main.temp}℃`;
  humidityMain.textContent = `${main.humidity}%`;
  windMain.textContent = `${wind.speed} km/h`;
  weatherIconMain.src = `https://openweathermap.org/img/w/${weather[0].icon}.png`;
  descriptionMain.textContent = `${weather.description}`;
}
