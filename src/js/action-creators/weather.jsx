'use strict';

import axios from 'axios';
import {weatherKey} from '../apiKeys';

import ChromePromise from 'chrome-promise';

const chromep = new ChromePromise();

import {
  RECEIVE_WEATHER
} from '../constants';

const openweather =
  `http://api.openweathermap.org/data/2.5/weather?APPID=${weatherKey}`;

// Helper function
function getPreciseLocation(){
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(position => {
			resolve(position.coords );
		});
	});
}

// Action creator function
export const receiveWeather = (weather) =>
  ({weather, type: RECEIVE_WEATHER});

export const fetchWeather = (zip) =>
  dispatch => {
    axios.get(`${openweather}&zip=${zip},us`)
    .then(res => res.data)
    .then(data => dispatch(receiveWeather(data)))
    .catch(err => console.error('Problem fetching weather', err));
  };


//https://api.ipify.org/?format=json
