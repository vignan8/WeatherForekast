let weather = {
    apiKey: "20a36f8e1152244bbbd9ac296d3640f2",
    fetchWeather: function (city) {
      fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=" +
          city +
          "&units=metric&appid=" +
          this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
          }
          return response.json();
        })
        .then((data) => {
          this.displayWeather(data);
          return this.fetchForecast(city);
        })
        .then((data) => this.displayForecast(data));
    },
    fetchForecast: function (city) {
      return fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${this.apiKey}`
      )
        .then((response) => {
          if (!response.ok) {
            alert("No forecast found.");
            throw new Error("No forecast found.");
          }
          return response.json();
        });
    },
    displayWeather: function (data) {
      const { name, sys } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      const tempFahrenheit = (temp * 9) / 5 + 32;
      document.querySelector(".city").innerHTML = `Weather in ${name}`;
      document.querySelector(".icon").src = `https://openweathermap.org/img/wn/${icon}.png`;
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerHTML = `${temp.toFixed(2)}°C | ${tempFahrenheit.toFixed(2)}°F`;
      document.querySelector(".humidity").innerText = `Humidity: ${humidity}%`;
      document.querySelector(".wind").innerText = `Wind speed: ${speed} km/h`;
      document.querySelector(".weather").classList.remove("loading");
      document.body.style.backgroundImage = `url('https://source.unsplash.com/1600x900/?${name}')`;
    },
    displayForecast: function (data) {
      let forecastData = "";
      for (let i = 0; i < data.list.length; i++) {
        const { dt_txt } = data.list[i];
        if (dt_txt.includes("12:00:00")) {
          const { icon } = data.list[i].weather[0];
          const { temp } = data.list[i].main;
          const tempFahrenheit = (temp * 9) / 5 + 32;
          forecastData += `
              <div class="forecast-item">
                  <img class="forecast-icon" src="https://openweathermap.org/img/wn/${icon}.png" alt="">
                  <div class="forecast-text">
                      <p class="forecast-date">${dt_txt.slice(0, 10)}</p>
                      <p class="forecast-temp">${temp.toFixed(2)}°C | ${tempFahrenheit.toFixed(2)}°F</p>
                  </div>
              </div>
          `;
        }
      }
      document.querySelector(".forecast").innerHTML = forecastData;
    },
    search: function () {
      const city = document.querySelector(".search-bar").value;
      this.fetchWeather(city);
    },
    searchByLocation: function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            fetch(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.apiKey}`
            )
              .then((response) => {
                if (!response.ok) {
                  alert("No weather found.");
                  throw new Error("No weather found.");
                }
                return response.json();
              })
              .then((data) => {
                const city = data.name;
                this.fetchWeather(city);
              });
          },
          (error) => {
            alert("Unable to retrieve your location.");
            console.error(error);
          }
        );
      } else {
        alert("Location is not supported by your browser.");
      }
    },
  };
  
  document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
  });
  
  document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
      weather.search();
    }
  });
  
  document.querySelector(".location-button").addEventListener("click", function () {
    weather.searchByLocation();
  });
  
  weather.fetchWeather("Hyderabad");
  