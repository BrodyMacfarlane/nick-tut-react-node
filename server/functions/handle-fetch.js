const fetch = require('node-fetch')

module.exports = (city) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&APPID=${process.env.WEATHER_API_KEY}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => resolve(json))
  })
}