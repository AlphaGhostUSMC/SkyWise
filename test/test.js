// Set API endpoint
const endpointWeather = "https://api.openweathermap.org/data/2.5/weather";
const endpointForecast = "https://api.openweathermap.org/data/2.5/forecast";

// Set API key
const apiKey = "1d4298744e7a95525f475935e6ec25db";

// Get the search input element
const searchInput = document.querySelector("#location-search-input");

// Get the weather data based on the search input
async function getWeatherData() {
  try {
    // Construct the API URL with the search input and API key
    const url = `${endpointWeather}?q=${searchInput.value}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    // Display weather data in the UI
    displayWeather(data);
    getCoordinates(data);
  } catch (error) {
    console.error(error);
  }
}

// Get the forecast data based on the search input
async function getForecastData() {
  try {
    // Construct the API URL with the search input and API key
    const url = `${endpointForecast}?q=${searchInput.value}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    // Display weather data in the UI
    displayForecast(data);
  } catch (error) {
    console.error(error);
  }
}

async function getNextDayIndex() {
  try {
    // Construct the API URL with the search input and API key
    const url = `${endpointForecast}?q=${searchInput.value}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    // Display weather data in the UI
    nextDayIndex(data);
  } catch (error) {
    console.error(error);
  }
}


// Update the weather data when the search form is submitted
const searchForm = document.querySelector(".get-weather");
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  getWeatherData();
  getForecastData();
  getNextDayIndex();
});

// Update the weather data when the page loads
// window.addEventListener("load", () => {
//   getWeatherData();
// });



function displayWeather(data) {
  const { name, main, weather } = data;
  const cityMain = document.querySelector(".city-name-main");
  const tempMain = document.querySelector(".temp-main");
  const descriptionMain = document.querySelector(".temp-description");
  const weatherIcon = {
    "overcast clouds": "assets/img/weather-icons/overcast-clouds.png",
    "few clouds": "assets/img/weather-icons/partly-cloud.png",
    "broken clouds": "assets/img/weather-icons/broken-clouds.png",
    "scattered clouds": "assets/img/weather-icons/scattered-clouds.png",
    haze: "assets/img/weather-icons/haze.png",
    "clear sky": "assets/img/weather-icons/sunny.png",
    "light rain": "assets/img/weather-icons/light-rain.png",
    "mist": "assets/img/weather-icons/mist.png",
    "moderate rain": "assets/img/weather-icons/moderate-rain.png",
  };
  const currentWeatherIcon = document.querySelector(".weather-icon-main");
  const weatherDescription = weather[0].description;

  cityMain.textContent = name + ", " + data.sys.country;
  tempMain.textContent = main.temp + " ℃";
  descriptionMain.textContent = weather[0].description;
  currentWeatherIcon.src = weatherIcon[weatherDescription];

  const humidityMain = document.querySelector(".humidity-main");
  const visibilityMain = document.querySelector(".visibility-distance-text");
  const atmPressureMain = document.querySelector(".atm-pressure-text");

  humidityMain.textContent = main.humidity + "%";
  visibilityMain.textContent = data.visibility / 1000 + " km";
  atmPressureMain.textContent = main.pressure + " hPa";

  const windSpeed = document.querySelector(".wind-main");
  const windDirection = document.querySelector(".wind-direction-degree-text");
  const windGustSpeed = document.querySelector(".gust-speed-text");

  windSpeed.textContent = data.wind.speed + " m/s";
  windDirection.textContent = data.wind.deg + "°";
  windGustSpeed.textContent = data.wind.gust + " m/s";

  function wind_direction(deg) {
    const dirs = [
      "N",
      "NNE",
      "NE",
      "ENE",
      "E",
      "ESE",
      "SE",
      "SSE",
      "S",
      "SSW",
      "SW",
      "WSW",
      "W",
      "WNW",
      "NW",
      "NNW",
    ];
    return dirs[Math.round((deg % 360) / 22.5)];
  }

  const deg = data.wind.deg;
  const direction = wind_direction(deg);
  console.log("Wind direction: " + direction);

  const directionIcon = {
    N: "assets/img/directions/N.png",
    NNE: "assets/img/directions/NNE.png",
    NE: "assets/img/directions/NE.png",
    ENE: "assets/img/directions/ENE.png",
    E: "assets/img/directions/E.png",
    ESE: "assets/img/directions/ESE.png",
    SE: "assets/img/directions/SE.png",
    SSE: "assets/img/directions/SSE.png",
    S: "assets/img/directions/S.png",
    SSW: "assets/img/directions/SSW.png",
    SW: "assets/img/directions/SW.png",
    WSW: "assets/img/directions/WSW.png",
    W: "assets/img/directions/W.png",
    WNW: "assets/img/directions/WNW.png",
    NW: "assets/img/directions/NW.png",
    NNW: "assets/img/directions/NNW.png",
  };

  const windDirectionIcon = document.querySelector(".wind-direction-icon");
  windDirectionIcon.src = directionIcon[direction];
}


function getCoordinates(data) {
  const { coord } = data;
  const lat = coord.lat;
  const lon = coord.lon;
  console.log("Latitude: " + lat);
  console.log("Longitude: " + lon);
  return { lat, lon };
}


function getDate() {
  const today = new Date();
  today.setHours(today.getHours() + 5); // Add 5 hours
  today.setMinutes(today.getMinutes() + 30); // Add 30 minutes
  const date = today.toISOString().split("T")[0];
  return date;
}


console.log(getDate());

function nextDayIndex(data) {
  const date = getDate();
  const { list } = data;
  let listIndex = 0;
  let today = list[listIndex].dt_txt.slice(0, 10);
  while (date === today) {
    listIndex++;
    if (date !== today) {
      break;
    }
    today = list[listIndex].dt_txt.slice(0, 10);
  }
  console.log("Current date is: " + date);
  console.log("Forecast date is: " + today);
  console.log("Next day index is: " + listIndex);
  const forecastIndex = listIndex;
  return forecastIndex;
}

function getWeekdayNames() {
  const today = new Date();
  const weekdayNames = [];

  for (let i = 0; i < 6; i++) {
    const dayName = today.toLocaleString("default", { weekday: "long" });
    weekdayNames.push(dayName);
    today.setDate(today.getDate() + 1);
  }

  return weekdayNames;
}

const weekdayNames = getWeekdayNames();


function displayForecast(data) {

  const day1 = document.querySelector(".day1-text");
  const day2 = document.querySelector(".day2-text");
  const day3 = document.querySelector(".day3-text");
  const day4 = document.querySelector(".day4-text");
  const day5 = document.querySelector(".day5-text");

  day1.textContent = weekdayNames[1];
  day2.textContent = weekdayNames[2];
  day3.textContent = weekdayNames[3];
  day4.textContent = weekdayNames[4];
  day5.textContent = weekdayNames[5];


  const { list } = data;
  let indexVal = nextDayIndex(data);
  const forecastDay1Hour1 = document.querySelector(".forecast-day1-hour1");
  const forecastDay1Hour2 = document.querySelector(".forecast-day1-hour2");
  const forecastDay1Hour3 = document.querySelector(".forecast-day1-hour3");
  const forecastDay1Hour4 = document.querySelector(".forecast-day1-hour4");

  forecastDay1Hour1.textContent = list[indexVal].dt_txt.slice(11, 16);
  forecastDay1Hour2.textContent = list[indexVal + 1].dt_txt.slice(11, 16);
  forecastDay1Hour3.textContent = list[indexVal + 2].dt_txt.slice(11, 16);
  forecastDay1Hour4.textContent = list[indexVal + 3].dt_txt.slice(11, 16);
}


const endpointSunsetSunrise = "https://api.sunrise-sunset.org/json?";
const lat = getCoordinates(data).lat;
const lon = getCoordinates(data).lon;
async function getSunsetSunrise() {
  try {
    const url = `${endpointSunsetSunrise}lat=${lat}&lng=${lon}&date=${date}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    displaySunsetSunrise(data);
  } catch (error) {
    console.log(error);
  }
}

function displaySunsetSunrise(data) {
  const { results } = data;
  const sunrise = results.sunrise
  const sunset = results.sunset

  const sunriseTime = document.querySelector(".sunrise-text1");
  const sunsetTime = document.querySelector(".sunset-text1");

  sunriseTime.textContent = sunrise;
  sunsetTime.textContent = sunset;
}

async function getSunriseSunset(longitude, latitude) {
  try {
    const sunriseSunsetDays = getNext5Days();
    for(let i=0; i<5; i++) {
      const url = `${endpointSunsetSunrise}lat=${latitude}&lng=${longitude}&date=${sunriseSunsetDays[i]}`;
      const response = await fetch(url);
      const data = await response.json();
      displaySunriseSunset(data, i);
    }
  } catch (error) {
    console.error(error);
  }
}

function displaySunriseSunset(data, index) {
  const sunrise = document.querySelector(`.sunrise-text${index+1}`);
  const sunset = document.querySelector(`.sunset-text${index+1}`);
  sunrise.textContent = data.results.sunrise;
  sunset.textContent = data.results.sunset;
}

