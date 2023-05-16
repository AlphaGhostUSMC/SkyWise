const searchInput = document.querySelector("#location-search-input");

const searchForm = document.querySelector(".get-weather");
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const date = new Date();
  date.setTime(date.getTime() + 3600 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = "searchInput" + "=" + searchInput.value + ";" + expires + ";path=/";
  getCoordinates();
});

// Read the cookie when the page is loaded
const cookieValue = document.cookie
  .split('; ')
  .find(row => row.startsWith('searchInput='))
  .split('=')[1];
if (cookieValue) {
  searchInput.value = cookieValue;
  getCoordinates();
}

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
  const { list } = data;
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

  const forecastIndex = nextDayIndex(data);
  console.log(forecastIndex);

  const forecastTime1 = document.querySelector(".forecast-day1-hour1");

  forecastTime1.textContent = list[forecastIndex].dt_txt.slice(11, 16);
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