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
  const weekdayNames = [];
  for (let i = 0; i < 7; i++) {
    weekdayNames.push(date.toLocaleDateString("en-US", { weekday: "long" }));
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

  let indexVal = nextDayIndex(data);
  const forecastDay1Hour1 = document.querySelector(".forecast-day1-hour1");
  const forecastDay1Hour2 = document.querySelector(".forecast-day1-hour2");
  const forecastDay1Hour3 = document.querySelector(".forecast-day1-hour3");
  const forecastDay1Hour4 = document.querySelector(".forecast-day1-hour4");
  const forecastDay1Hour5 = document.querySelector(".forecast-day1-hour5");

  forecastDay1Hour1.textContent = list[indexVal + 2].dt_txt.slice(11, 16);
  forecastDay1Hour2.textContent = list[indexVal + 3].dt_txt.slice(11, 16);
  forecastDay1Hour3.textContent = list[indexVal + 4].dt_txt.slice(11, 16);
  forecastDay1Hour4.textContent = list[indexVal + 5].dt_txt.slice(11, 16);
  forecastDay1Hour5.textContent = list[indexVal + 6].dt_txt.slice(11, 16);

  const forecastDay2Hour1 = document.querySelector(".forecast-day2-hour1");
  const forecastDay2Hour2 = document.querySelector(".forecast-day2-hour2");
  const forecastDay2Hour3 = document.querySelector(".forecast-day2-hour3");
  const forecastDay2Hour4 = document.querySelector(".forecast-day2-hour4");
  const forecastDay2Hour5 = document.querySelector(".forecast-day2-hour5");

  forecastDay2Hour1.textContent = list[indexVal + 10].dt_txt.slice(11, 16);
  forecastDay2Hour2.textContent = list[indexVal + 11].dt_txt.slice(11, 16);
  forecastDay2Hour3.textContent = list[indexVal + 12].dt_txt.slice(11, 16);
  forecastDay2Hour4.textContent = list[indexVal + 13].dt_txt.slice(11, 16);
  forecastDay2Hour5.textContent = list[indexVal + 14].dt_txt.slice(11, 16);

  const forecastDay3Hour1 = document.querySelector(".forecast-day3-hour1");
  const forecastDay3Hour2 = document.querySelector(".forecast-day3-hour2");
  const forecastDay3Hour3 = document.querySelector(".forecast-day3-hour3");
  const forecastDay3Hour4 = document.querySelector(".forecast-day3-hour4");
  const forecastDay3Hour5 = document.querySelector(".forecast-day3-hour5");

  forecastDay3Hour1.textContent = list[indexVal + 18].dt_txt.slice(11, 16);
  forecastDay3Hour2.textContent = list[indexVal + 19].dt_txt.slice(11, 16);
  forecastDay3Hour3.textContent = list[indexVal + 20].dt_txt.slice(11, 16);
  forecastDay3Hour4.textContent = list[indexVal + 21].dt_txt.slice(11, 16);
  forecastDay3Hour5.textContent = list[indexVal + 22].dt_txt.slice(11, 16);

  const forecastDay4Hour1 = document.querySelector(".forecast-day4-hour1");
  const forecastDay4Hour2 = document.querySelector(".forecast-day4-hour2");
  const forecastDay4Hour3 = document.querySelector(".forecast-day4-hour3");
  const forecastDay4Hour4 = document.querySelector(".forecast-day4-hour4");
  const forecastDay4Hour5 = document.querySelector(".forecast-day4-hour5");

  forecastDay4Hour1.textContent = list[indexVal + 26].dt_txt.slice(11, 16);
  forecastDay4Hour2.textContent = list[indexVal + 27].dt_txt.slice(11, 16);
  forecastDay4Hour3.textContent = list[indexVal + 28].dt_txt.slice(11, 16);
  forecastDay4Hour4.textContent = list[indexVal + 29].dt_txt.slice(11, 16);
  forecastDay4Hour5.textContent = list[indexVal + 30].dt_txt.slice(11, 16);

  const forecastDay5Hour1 = document.querySelector(".forecast-day5-hour1");
  const forecastDay5Hour2 = document.querySelector(".forecast-day5-hour2");
  const forecastDay5Hour3 = document.querySelector(".forecast-day5-hour3");
  const forecastDay5Hour4 = document.querySelector(".forecast-day5-hour4");
  const forecastDay5Hour5 = document.querySelector(".forecast-day5-hour5");

  forecastDay5Hour1.textContent = list[indexVal + 34].dt_txt.slice(11, 16);
  forecastDay5Hour2.textContent = list[indexVal + 35].dt_txt.slice(11, 16);
  forecastDay5Hour3.textContent = list[indexVal + 36].dt_txt.slice(11, 16);
  forecastDay5Hour4.textContent = list[indexVal + 37].dt_txt.slice(11, 16);
  forecastDay5Hour5.textContent = list[indexVal + 38].dt_txt.slice(11, 16);

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