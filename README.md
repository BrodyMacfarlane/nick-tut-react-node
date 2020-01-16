# Let's get it. ⚛︎

I've started this project with a run of create-react-app using

`npx create-react-app nick-tut-react-node`

You can do that as well on your desktop or you can clone this master branch and follow along with that.  Both yield the same result.

The format of this project will follow a branch style step-based approach, i.e. I will leave this master branch as is, and will push new code to different branches pertaining to each step.  Each step will have their corresponding branch listed in parentheses after the step number and step title on these instructions, like this:

## Step 0 - Update readme.md (master)

You dont need to do anything for this step, just read. :)

So without further ado, let's begin by explaining the MVP (minimum viable product).

We're going to be building a weather app to have a text input that can take in any city name, and display the temperature and any significant weather conditions there (rain, snow, overcast, clear, etc.).

#### Key features we're going to want:

* Input field for a city name that we will use to hit the "openweathermap.org" weather API.
* Error handling, in case of bad user input or bad response from weather API.
* Loading animation while our server hits their API endpoint and waits for the requested data.
* A display of the current weather formatted like, "The current weather in {city} is {conditions} and {temperature}°F."

---

## Step 1 - File structuring and obtain openweathermap.org API token (openweather-dotenv)

First thing we are going to do is install the dotenv library, and create our server folder and the basis of our main server file.

Run in the project root directory

`npm i dotenv`

or

`npm install dotenv`

(they do the same thing)

This dotenv library will allow us to place secret things inside a .env file on our project directory.  These are things that you do not want revealed to the public or stored on GitHub such as passwords, API tokens, secrets, database connection strings or the number of times you shit your pants in 2019 👀.

---

Next, we're going to create a few directories and files.  We're going to want the following:

***directory/folder***

`nick-tut-react-node/server/`


***files***

`nick-tut-react-node/server/index.js`

`nick-tut-react-node/.env`

---

Now we're going to make sure when we push our code to GitHub that it doesn't upload our `.env` file, so in our `nick-tut-react-node/.gitignore` we'll add
```
.env
```
into it's own line.

---

Let's also make it easier to run our server from our main project directory by adding this to the main object in our `package.json`.

Inside
`nick-tut-react-node/package.json`

Add
```
,
"main": "./server/index.js",
"proxy": "http://localhost:6969"
```

The "main" line tells node that when we just type `node` or `nodemon` from `nick-tut-react-node/`, that our server file is located at `nick-tut-react-node/server/index.js`.

The "proxy" line tells our frontend that our server is located at `http://localhost:6969` and that it will be in between all of our API calls.

---

Finally, we are going sign up for an account at

https://home.openweathermap.org/users/sign_up

to get an API token from

https://home.openweathermap.org/api_keys

and place it in our .env file like this (if our api key was 'lol696969696969'):

`WEATHER_API_KEY=lol696969696969`

---

## Step 2 - Set up server (server)

In this step, we will get our server set up to be able to handle a POST request with a city name and fetch that data from the weather API.

Instead of using axios (axios is not maintained anymore, and is vulnerable), we will use node-fetch.

Fetch is built into JavaScript, so on the front end, this library is not needed.  However, since we need this on our node backend, we will use this library there.

We also need express, body-parser, and cors (it's a good idea to install all of these for any server with endpoints that you build).

---

Run in the project root directory

`npm i node-fetch express body-parser cors`

---

### `server/index.js` file.

On line 1 we need to tell node to use our dotenv file, so we can use this line of code.

`require('dotenv').config()`


Then we can bring in our modules and middleware, except for node-fetch, which we will use in our own module.

File should look like this:

```
require('dotenv').config()

const express = require('express')
    , cors = require('cors')
    , bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(cors())


// ENDPOINTS HERE


const PORT = 6969
app.listen(PORT, () => console.log(`listening on port: ${PORT}`))
```

---

We are going to create a file in `nick-tut-react-node/server/functions/handle-fetch.js`, which exports a `handleFetch` function that takes in a city name as a string, and uses node-fetch to get that data from the openweather API.

`nick-tut-react-node/server/functions/handle-fetch.js` file should look like this:

```
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
```

---

Now we can start to build out the POST endpoint to handle the data coming from our frontend to our server and will use our handleFetch function to send that data to the openweather API and send our response back to our frontend.  

`server/index.js`

```
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
    res.send({"cod":"400","message":"No valid city provided"})
  }
})


const PORT = 6969
app.listen(PORT, () => console.log(`listening on port: ${PORT}`))
```

At this point we should be able to start the server using `node .` or `nodemon` to fire up Postman and send it a request to `http://localhost:6969/api/fetchWeather` with the body as

```
{
	"city": "Draper"
}
```

and get back our response from the open weather api.

Now to build the frontend!

## Step 3 - Spin up frontend (frontend)

Lets get rid of the default create-react-app page and styles.

`App.js`

```
import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      
    </div>
  );
}

export default App;

```

also, I deleted everything inside of App.css, but kept the file.

---

Let's build our input, button, and main UI and tie them up with state.

I'm going to use hooks because they're fantastic, but see if you can do this using class components and this.state without looking at my code.

The main thing here is that you will want a function that you use in your App.js to hit the endpoint of out server posting the city that is inside the input.

Don't have much time to wrap this up, feel free to check my "frontend" branch for the solution, and if you have any questions just hit my line, yo.

## 🍻
