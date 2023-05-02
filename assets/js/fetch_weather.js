// Get the city input and weather results elements
const cityInput = document.querySelector("#location-search-input");
const weatherResults = document.querySelector("#weather-card-main");

// Add a submit event listener to the form
document.querySelector("#get-weather").addEventListener("submit", (e) => {
  // Prevent the default form submission behavior
  e.preventDefault();

  // Get the city entered by the user
  const city = cityInput.value;

  // Make a GET request to the weather API
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=1d4298744e7a95525f475935e6ec25db`
  )
    .then((response) => response.json())
    .then((data) => {
      // Check if the city was found
      if (data.cod === "404") {
        weatherResults.innerHTML = "<p>City not found</p>";
      } else {
        // Display the weather data
        const weather = data.weather[0];
        const main = data.main;
        weatherResults.innerHTML = `
          <p>Temperature: ${main.temp}°C</p>
          <p>Coverage: ${weather.main}</p>
          <p>Description: ${weather.description}</p>
          <p>Humidity: ${main.humidity}%</p>
          <p>Wind speed: ${data.wind.speed} kph</p>
        `;
      }
    })
    .catch((error) => {
      console.error(error);
      weatherResults.innerHTML = "<p>An error occurred</p>";
    });
});


