const endpointWeather = "https://api.openweathermap.org/data/2.5/weather";
const endpointForecast = "https://api.openweathermap.org/data/2.5/forecast";
const endpointSunsetSunrise = "https://api.sunrisesunset.io/json?";
const endpointCoordinates = "https://api.openweathermap.org/geo/1.0/direct"
const apiKey = "1d4298744e7a95525f475935e6ec25db";

const searchInput = document.querySelector("#location-search-input");


async function getCoordinates() {
  try {
    const url = `${endpointCoordinates}?q=${searchInput.value}&limit=1&appid=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    getLongLati(data);
  } catch (error) {
    console.error(error);
  }
}

const searchForm = document.querySelector(".get-weather");
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  getCoordinates();
});


function getLongLati(data) {
  const longitude = data[0].lon;
  const latitude = data[0].lat;
  getWeatherData(longitude, latitude);
  getForecastData(longitude, latitude);
  getSunriseSunset(longitude, latitude);
}

async function getWeatherData(longitude, latitude) {
  try {
    const url = `${endpointWeather}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error(error);
  }
}

async function getForecastData(longitude, latitude) {
  try {
    const url = `${endpointForecast}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();
    displayForecast(data);
    nextDayIndex(data);
  } catch (error) {
    console.error(error);
  }
}


async function getSunriseSunset(longitude, latitude) {
  try {
    const sunriseSunsetDays = getNext5Days();
    for (let i = 0; i < 5; i++) {
      const url = `${endpointSunsetSunrise}lat=${latitude}&lng=${longitude}&date=${sunriseSunsetDays[i]}`;
      const response = await fetch(url);
      const data = await response.json();
      displaySunriseSunset(data, i);
    }
  } catch (error) {
    console.error(error);
  }
}

function displayWeather(data) {

  // Main Weather card Section
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

  // Humidity, Pressure and Visibility
  const humidityMain = document.querySelector(".humidity-main");
  const visibilityMain = document.querySelector(".visibility-distance-text");
  const atmPressureMain = document.querySelector(".atm-pressure-text");

  humidityMain.textContent = main.humidity + "%";
  visibilityMain.textContent = data.visibility / 1000 + " km";
  atmPressureMain.textContent = main.pressure + " hPa";

  // Wind Speed, Direction and Gust
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

// Get Weekday Names and Index of next day
function nextDayIndex(data) {
  const { list } = data;
  const date = new Date().toISOString().split("T")[0];
  let listIndex = 0;
  let today = list[listIndex].dt_txt.slice(0, 10);
  console.log(today);
  while (date === today) {
    listIndex++;
    if (date !== today) {
      break;
    }
    today = list[listIndex].dt_txt.slice(0, 10);
  }
  const forecastIndex = listIndex;
  return forecastIndex;
}

function getWeekdayNames() {
  const date = new Date();
  const options = { timeZone: "Asia/Kolkata", weekday: "long" };
  const weekdayNames = [];
  for (let i = 0; i < 7; i++) {
    weekdayNames.push(date.toLocaleDateString("en-US", options));
    date.setDate(date.getDate() + 1);
  }
  return weekdayNames;
}

let weekdayNames = getWeekdayNames();

console.log(weekdayNames);

// Forecast Section

function displayForecast(data) {
  // const { list } = data;
  const dayElements = document.querySelectorAll(".day-text");

  for (let i = 0; i < 5; i++) {
    dayElements[i].textContent = weekdayNames[i + 1];
  }
}


function getNext5Days() {
  let currentDate = new Date();
  let next5Days = [];

  for (let i = 1; i <= 5; i++) {
    let nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + i);
    let formattedDate = nextDate.toISOString().split('T')[0];
    next5Days.push(formattedDate);
  }

  return next5Days;
}

// Example usage:
let date = getNext5Days();
console.log(date);

function displaySunriseSunset(data, index) {
  const sunrise = document.querySelector(`.sunrise-text${index + 1}`);
  const sunset = document.querySelector(`.sunset-text${index + 1}`);
  sunrise.textContent = data.results.sunrise;
  sunset.textContent = data.results.sunset;
}