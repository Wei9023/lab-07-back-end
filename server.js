'use strict';

// Load environmnet variables from .env file
require('dotenv').config();

// Application dependencies
const express = require('express');
const superagent = require('superagent');
const cors = require('cors');

// Application setup
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());

// API ROUTES
app.get('/location', (request, response) => {
  searchToLatLong(request.query.data)
    .then(location => response.send(location))
    .catch(error => handleError(error, response));
});

// Need a route so client can request weather data
app.get('/weather', getWeather);

// TODO:
// You will need to put a meetups route here that uses the meetups handler that you will create

// Need a catch-all route that invokes handle-Error() if bad request comes in
app.use('*', (err, res) => {
  handleError(err, res);
});

// Make sure server is listening for requests
app.listen(PORT, () => console.log(`App is up on ${PORT}`));

// HELPER FUNCTIONS

// Error handler
function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went wrong');
}

function searchToLatLong(query) {
  const geoData = require('./data/geo.json');
  const location = new Location(query, geoData);
  console.log('location in searchToLatLong()', location);
  return location;
}

function Location(query, res) {
  console.log('res in Location()', res);
  this.search_query = query;
  this.formatted_query = res.results[0].formatted_address;
  this.latitude = res.results[0].geometry.location.lat;
  this.longitude = res.results[0].geometry.location.lng;
}

function getWeather() {
  const darkskyData = require('./data/darksky.json');

  // Refactored function using .map() instead of forEach()
  const weatherSummaries = darkskyData.daily.data.map(new Weather(day));

  // Return the new array that's been filled with instances
  console.log('weather in searchToLatLong()', weatherSummaries);
  return weatherSummaries;
}

// Constructor needed for function getWeather()
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}
