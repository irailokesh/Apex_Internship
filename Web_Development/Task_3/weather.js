async function getWeather() {
  const city = document.getElementById("city").value.trim();
  const apiKey = "4d0b9ec74d7bf7f017d6262f098e31b8";
  const resultDiv = document.getElementById("weatherResult");

  if (!city) {
    resultDiv.innerHTML = "Please enter a city name.";
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();

    if (data.cod === 200) {
      resultDiv.innerHTML = `
        <h3>${data.name}, ${data.sys.country}</h3>
        <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
        <p><strong>Condition:</strong> ${data.weather[0].description}</p>
        <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
        <p><strong>Wind:</strong> ${data.wind.speed} m/s</p>
      `;
    } else {
      resultDiv.innerHTML = "City not found.";
    }
  } catch (error) {
    resultDiv.innerHTML = "Error fetching weather data.";
  }
}
