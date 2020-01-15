require('dotenv').config()

const express = require('express')
    , cors = require('cors')
    , bodyParser = require('body-parser')
    , handleFetch = require('./functions/handle-fetch')

const app = express()

app.use(bodyParser.json())
app.use(cors())


app.post('/api/fetchWeather', (req, res, next) => {
  if (typeof req.body.city === 'string') {
    handleFetch(req.body.city)
      .then(weather => res.send(weather))
      .catch(next)
  }
  else {
    res.send({error: "Invalid city name."})
  }
})


const PORT = 6969
app.listen(PORT, () => console.log(`listening on port: ${PORT}`))