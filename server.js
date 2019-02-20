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

// **************************
// Helper Functions
// **************************

// Error handler
function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went wrong');
}

// Geocode lookup handler
function searchToLatLong(query) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_KEY}`;

  return superagent.get(url)
    .then(res => {
      return new Location(query, res);
    })
    .catch(error => handleError(error));
}

// Weather route handler
function getWeather(resquest, response) {
  console.log('called getWeather');
  console.log('request.query.data:', request.query.data);
  const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data.latitude},${request.data.longitude}`;

  console.log('url:', url);

  superagent.get(url)
    .then(result => {
      const weatherSummaries = result.body.daily.data.map(day => {
        return new Weather(day)
      });

      console.log('weatherSummaries:', weatherSummaries);


      response.send(weatherSummaries);
    })
    .catch(error => handleError(error, response));
}

// TODO
// Meetups route handler
// This is where you will need to put the handler for your meetup route

// **************************
// Models
// **************************

function Location(query, res) {
  console.log('res in Location()', res);
  this.search_query = query;
  this.formatted_query = res.body.results[0].formatted_address;
  this.latitude = res.body.results[0].geometry.location.lat;
  this.longitude = res.body.results[0].geometry.location.lng;
}

// Constructor needed for function getWeather()
function Weather(day) {
  this.forecast = day.summary;
  this.time = new Date(day.time * 1000).toString().slice(0, 15);
}

// TODO:
// This is where you will need to put the constructor for your meetups data

function Meetups() { }