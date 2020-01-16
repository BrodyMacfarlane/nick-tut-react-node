import React from 'react';
import './App.css';
import { handlePostCity, convertWeatherObj } from './functions'

function App() {
  const [ cityInput, setCityInput ] = React.useState('')
  const [ weather, setWeather ] = React.useState(null)
  const [ loading, setLoading ] = React.useState(false)
  const [ error, setError ] = React.useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    setWeather(null)
    setError(null)
    setLoading(true)

    handlePostCity(cityInput)
      .then(weather => {
        setLoading(false)

        if (weather.message) {
          setError(weather)
        }
        else {
          setWeather(convertWeatherObj(weather))
        }
      })
  }

  return (
    <div className="App">
      <div className="container">
        <form onSubmit={(e) => handleSubmit(e)}>
          <input type="text" id="city-input" onChange={(e) => setCityInput(e.target.value)} value={cityInput} placeholder="City Name"/>
          <input type="submit" id="city-submit" value="Submit"/>
        </form>
      </div>

      {
        error &&
        <div id="error-container" className="container">
          <p id="error">{error.message}</p>
        </div>
      }

      {
        loading &&
        <div id="loading-container" className="container">
          <div className="lds-dual-ring"></div>
        </div>
      }

      {
        weather &&
          <div id="weather-container" className="container">
            <p id="weather">{`The current weather in ${weather.city} is ${weather.condition} and ${weather.temp}°F.`}</p>
          </div>
      }

    </div>
  );
}

export default App;
