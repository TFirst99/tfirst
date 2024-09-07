import clear from './clear.js';
import clouds from './clouds.js';
import rain from './rain.js';
import snow from './snow.js';
import mist from './mist.js';
import drizzle from './drizzle.js';
import thunderstorm from './thunderstorm.js';

export default function(year) {
  return {
    clear: clear(year),
    clouds: clouds(year),
    rain: rain(year),
    snow: snow(year),
    mist: mist(year),
    drizzle: drizzle(year),
    thunderstorm: thunderstorm(year)
  }
};
