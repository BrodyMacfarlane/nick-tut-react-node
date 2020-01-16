export const handlePostCity = (city) => {
  return fetch(`/api/fetchWeather`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({city})
  })
  .then(res => res.json())
}

export const convertWeatherObj = (weather) => {
  
  const convertKelvFarenheit = (kTemp) => {
    return Math.floor(((kTemp - 273.15) * 9/5 + 32) * 100) / 100
  }

  return {
    city: weather.name,
    condition: weather.weather[0].main,
    temp: convertKelvFarenheit(weather.main.temp)
  }
}