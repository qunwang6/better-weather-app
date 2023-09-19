import {getHoursAndMinutes, getDate, getDay} from "./datetime.js";
import {mapPercentageValue, getUvIndexDescription} from "./sun.js";
import {getWindForce, setWindDirection} from "./wind.js";
import {setWeatherMedia} from "./assets.js";
import {triggerPwaPopUp} from "./pwa.js";
import {setMap} from "./map.js";
import {triggerToast} from "./toast.js";
window.triggerToast = triggerToast;

/* -------------------- OpenWeatherMap APi Key  -------------------- */

export const apiKey = '6a77aa86d3e78ed643e5dc924862ffaa';

/* -------------------- Get data from local storage  -------------------- */

let locationArr = [];

if (localStorage.getItem('myWeatherLocationArr')) {
    locationArr = JSON.parse(localStorage.getItem('myWeatherLocationArr'));
} else {
    localStorage.setItem('myWeatherLocationArr', JSON.stringify(locationArr));
}

/* -------------------- Locations Settings Dialog  -------------------- */

const locationSettingsTemplate = document.querySelector('#settings-location-item');
const locationList = document.querySelector('#location-list');

function createLocationList() {
    document.querySelector('#location-list').innerHTML = '';

    for (let i = 0; i < locationArr.length; i++) {
        // create location items
        let locationSettingsItem = locationSettingsTemplate.cloneNode(true).content.querySelector('li');
        let locationName = locationSettingsItem.querySelector('.location-name');
        locationName.innerText = `${locationArr[i].name} (${locationArr[i].country})`;
        locationSettingsItem.setAttribute('data-location-lat', locationArr[i].lat);
        locationSettingsItem.setAttribute('data-location-lon', locationArr[i].lon);
        locationList.appendChild(locationSettingsItem);

        // Delete functionality/button
        locationSettingsItem.querySelector('button').addEventListener('click', function (e) {
            // Remove from DOM
            e.currentTarget.parentNode.remove();
            // Remove from locationArr
            locationArr.splice(locationArr.indexOf(locationArr[i]));
        });
    }
}

createLocationList();

/* -------------------- Drag and Drop Loaction Settings  -------------------- */

let dragSrcEl = null;
let dragSrcLat = 0;
let dragSrcLon = 0;

let dragSrcIndex;
let dropSrcIndex;

function handleDragStart(e) {
    this.style.opacity = '0.4';

    dragSrcEl = e.currentTarget;
    dragSrcLat = e.currentTarget.getAttribute('data-location-lat');
    dragSrcLon = e.currentTarget.getAttribute('data-location-lon');

    for (let i = 0; i < locationArr.length; i++) {
        console.log(locationArr[i].lat, locationArr[i].lon);
        if (locationArr[i].lat == dragSrcLat && locationArr[i].lon == dragSrcLon) {
            dragSrcIndex = i;
        }
    }

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', dragSrcEl.innerHTML);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '.4';
}

function handleDragEnter(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '.4';
}

function handleDragLeave(e) {
    e.currentTarget.style.opacity = '1';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '1';

    for (let i = 0; i < locationArr.length; i++) {
        if (locationArr[i].lat == this.getAttribute('data-location-lat') && locationArr[i].lon == this.getAttribute('data-location-lon')) {
            dropSrcIndex = i;
        }
    }

    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        dragSrcEl.setAttribute('data-location-lat', this.getAttribute('data-location-lat'));
        dragSrcEl.setAttribute('data-location-lon', this.getAttribute('data-location-lon'));

        this.innerHTML = e.dataTransfer.getData('text/html');
        this.setAttribute('data-location-lat', dragSrcLat);
        this.setAttribute('data-location-lon', dragSrcLon);
    }

    console.log(locationArr);

    let locationItemCopy1 = locationArr[dragSrcIndex];
    let locationItemCopy2 = locationArr[dropSrcIndex];
    console.log(dragSrcIndex);
    console.log(dropSrcIndex);


    locationArr[dragSrcIndex] = locationItemCopy2;
    locationArr[dropSrcIndex] = locationItemCopy1;

    console.log(locationArr);

    return false;
}

function handleDragEnd(e) {
    console.log('Drag end');
    this.style.opacity = '1';
}

let items = document.querySelectorAll('#location-list li[draggable=true]');
items.forEach(function (item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragenter', handleDragEnter, false);
    item.addEventListener('dragover', handleDragOver, false);
    item.addEventListener('dragleave', handleDragLeave, false);
    item.addEventListener('drop', handleDrop, false);
    item.addEventListener('dragend', handleDragEnd, false);
});

/* -------------------- Add current location  -------------------- */

getGeoLocation();

function getGeoLocation() {
    if (!navigator.geolocation) {
        triggerToast('Error', 'Geolocation not supported', 'error');
        // Get weatherdata when locations were added
        locationArr.length > 0 ? getData(locationArr) : null;
    } else {
        console.log('Locating…');
        navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
    }
}

function geolocationError() {
    triggerToast('Error', 'Geolocation not found', 'error');
    // Get weatherdata when locations were added
    locationArr.length > 0 ? getData(locationArr) : null;
}

function geolocationSuccess(position) {
    fetch('https://api.openweathermap.org/geo/1.0/reverse?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&limit=1&appid=' + apiKey)
        .then((response) => response.json())
        .then((locationData) => {
            if (locationData.cod) {
                // If API sends an Error
                triggerToast('Error', locationData.message, 'error');
            } else {
                // Get weather data for geolocation when location is not saved
                if (!JSON.stringify(locationArr).includes(locationData[0].lat) && !JSON.stringify(locationArr).includes(locationData[0].lon)) {
                    locationData[0].name = `📍 ${locationData[0].name}`;
                    getData(locationData);
                }

                // Get weatherdata when locations were added
                setTimeout(function () {
                    locationArr.length > 0 ? getData(locationArr) : null;
                }, 500);
            }
        })
}

/* -------------------- Search & Add Location Dialog  -------------------- */

const searchForm = document.querySelector('form#search-form');
const locationSearchResults = document.querySelector('ul#location-search-reults');
const locationSearchItem = document.querySelector('template#add-location-item').content.querySelector('li');
const searchInput = document.querySelector('input#search');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();

    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + searchInput.value + '&limit=5&appid=' + apiKey)
        .then((response) => response.json())
        .then((locationData) => {
            console.log('Searchresults:');
            console.log(locationData);

            if (locationData.cod) {
                // If API sends an Error
                triggerToast('Error', locationData.message, 'error');
            } else {
                // If API sends results
                locationSearchResults.innerHTML = '';

                if (locationData.length === 0) {
                    triggerToast('Error', 'Location not found.', 'error');
                } else {
                    for (let i = 0; i < locationData.length; i++) {
                        // Create list of results
                        let locationSearchItemClone = locationSearchItem.cloneNode(true);
                        locationSearchItemClone.setAttribute('data-location', locationData[i].name);
                        locationSearchItemClone.querySelector('dt').innerText = `${locationData[i].name}`;
                        locationSearchItemClone.querySelector('dd').innerText = locationData[i].state ? `(${locationData[i].country} | ${locationData[i].state})` : `(${locationData[i].country})`;
                        locationSearchResults.appendChild(locationSearchItemClone);

                        // Add location
                        locationSearchItemClone.addEventListener('click', function () {
                            if (!locationArr.includes(locationData[i])) {
                                locationArr.push(locationData[i]);
                                createLocationList();
                                triggerToast('Info', 'Location added.', 'info');
                            } else {
                                triggerToast('Error', 'Location already exists.', 'error');
                            }
                        });
                    }
                }
            }
        })
});

/* -------------------- Open / Close Dialog  -------------------- */

const dialogButtons = document.querySelectorAll('button[data-dialog-target]');
const dialogs = document.querySelectorAll('.dialog');

dialogButtons.forEach(button => {
    button.addEventListener('click', function openDialog(e) {
        // toggle dialog
        let dialogTarget = document.getElementById(e.currentTarget.getAttribute('data-dialog-target'));
        dialogTarget.classList.add('open');

        // prevent backgound scrolling
        document.querySelector('body').style.overflow = 'hidden';
    });
});

function closeDialog(e) {
    // Close dialog + enable scrolling
    dialogs.forEach(dialog => dialog.classList.remove('open'))
    document.querySelector('body').style.overflow = 'auto';

    // Save array and rerender weather app only when things changed
    if (JSON.stringify(locationArr) !== localStorage.getItem('myWeatherLocationArr')) {
        localStorage.setItem('myWeatherLocationArr', JSON.stringify(locationArr));
        document.querySelector('main').innerHTML = '';
        getGeoLocation();
    }
}

let closeDialogButtons = document.querySelectorAll('button.close-dialog');
closeDialogButtons.forEach(btn => btn.addEventListener('click', function() {
    closeDialog(this);
}));

/* -------------------- Get Weather Data  -------------------- */

let weatherLocationName;

function getData(locationArr, counter = 0) {
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + locationArr[counter].lat + '&lon=' + locationArr[counter].lon + '&appid=' + apiKey + '&units=metric&exclude=minutely')
        .then((response) => response.json())
        .then((weatherData) => {

            if (weatherData.cod) {
                // If API sends an Error
                triggerToast('Error', weatherData.message, 'error');
            } else {
                // Set location name for headline
                weatherLocationName = locationArr[counter].name;

                console.log(weatherLocationName);
                console.log(weatherData);

                // Set data in the app
                setWeatherData(weatherData);

                // Get data when there are more locations
                if (counter < locationArr.length - 1) {
                    counter++;
                    getData(locationArr, counter);
                } else {
                    counter = 0;
                }
            }
        });
}

/* -------------------- Enliven template with data  -------------------- */

function setWeatherData(weatherData) {
    // Clone template
    const weatherTemplate = document.querySelector('#weather-template');
    let weatherTemplateClone = weatherTemplate.cloneNode(true);

    // Set location name
    const weatherLocation = weatherTemplateClone.content.querySelector('.weather-location');
    weatherLocation.innerText = weatherLocationName;

    // Current weather video
    const currentWeatherVideo = weatherTemplateClone.content.querySelector('.current-weather-video > video');
    currentWeatherVideo.setAttribute('src', 'vid/' + setWeatherMedia(weatherData.current.weather[0], 'mp4') + '.mp4');

    // Current weather icon
    const currentWeatherIcon = weatherTemplateClone.content.querySelector('.current-weather-icon');
    currentWeatherIcon.setAttribute('src', 'images/icons/' + setWeatherMedia(weatherData.current.weather[0], 'svg') + '.svg');

    // Current Temp
    const currentTemperature = weatherTemplateClone.content.querySelector('.current-temperature-value');
    currentTemperature.innerText = Math.round(weatherData.current.temp);
    currentTemperature.parentNode.setAttribute('onclick', 'triggerToast("Now", "' + weatherData.current.weather[0].description + ' | ' + Math.round(weatherData.current.temp) + '°")');

    // Current Time
    let currentDayValue = getDay(weatherData.current.dt, weatherData.timezone_offset);
    let currentDateValue = getDate(weatherData.current.dt, weatherData.timezone_offset);
    let currentTimeValue = getHoursAndMinutes(weatherData.current.dt, weatherData.timezone_offset);
    const currentTimeContainer = weatherTemplateClone.content.querySelector('.current-time');
    currentTimeContainer.innerText = `${currentDayValue}, ${currentDateValue} - ${currentTimeValue}`;

    // Sun / Moon container
    const sunMoonContainer = weatherTemplateClone.content.querySelector('.sun-moon');
    sunMoonContainer.addEventListener('click', function (e) {
        e.currentTarget.classList.toggle('flipped');
    });

    // Sunrise
    const currentSunrise = weatherTemplateClone.content.querySelector('.current-sunrise-value');
    currentSunrise.innerText = getHoursAndMinutes(weatherData.current.sunrise, weatherData.timezone_offset);

    // Sunposition
    let currentSunpositionValue = mapPercentageValue(weatherData.current.sunrise, weatherData.current.sunset, weatherData.current.dt);

    const currentSunpositionIndicator = weatherTemplateClone.content.querySelector('.current-sunposition-indicator');
    currentSunpositionIndicator.style.left = currentSunpositionValue + '%';
    currentSunpositionValue === 0 ? currentSunpositionIndicator.style.opacity = 0 : currentSunpositionIndicator.style.opacity = 1;

    const currentSunpositionProgress = weatherTemplateClone.content.querySelector('.current-sunposition-progress');
    currentSunpositionProgress.style.width = currentSunpositionValue + '%';

    // Sunset
    const currentSunset = weatherTemplateClone.content.querySelector('.current-sunset-value');
    currentSunset.innerText = getHoursAndMinutes(weatherData.current.sunset, weatherData.timezone_offset);

    // Moonrise
    const currentMoonrise = weatherTemplateClone.content.querySelector('.current-moonrise-value');
    currentMoonrise.innerText = getHoursAndMinutes(weatherData.daily[0].moonset, weatherData.timezone_offset);

    // Moonposition
    let currentMoonpositionValue = mapPercentageValue(weatherData.daily[0].moonrise, weatherData.daily[0].moonset, weatherData.current.dt);

    const currentMoonpositionIndicator = weatherTemplateClone.content.querySelector('.current-moonposition-indicator');
    currentMoonpositionIndicator.style.left = currentMoonpositionValue + '%';
    currentMoonpositionValue === 0 ? currentMoonpositionIndicator.style.opacity = 0 : currentMoonpositionIndicator.style.opacity = 1;

    const currentMoonpositionProgress = weatherTemplateClone.content.querySelector('.current-moonposition-progress');
    currentMoonpositionProgress.style.width = currentMoonpositionValue + '%';

    // Moonset
    const currentMoonset = weatherTemplateClone.content.querySelector('.current-moonset-value');
    currentMoonset.innerText = getHoursAndMinutes(weatherData.daily[0].moonrise, weatherData.timezone_offset);

    // Show Moon Widget, when useful
    currentSunpositionValue === 0 && currentMoonpositionValue !== 0 ? sunMoonContainer.classList.add('flipped') : null;

    // Wind Direction
    weatherTemplateClone.content.querySelector('#needle').style.transform = 'rotate(' + weatherData.current.wind_deg + 'deg)';

    const currentWindDirection = weatherTemplateClone.content.querySelector('.current-wind-direction-value');
    currentWindDirection.innerText = setWindDirection(weatherData.current.wind_deg, false);
    currentWindDirection.parentNode.setAttribute('onclick', `triggerToast("Winddirection", "${setWindDirection(weatherData.current.wind_deg)} | ${weatherData.current.wind_deg}°")`);

    // Wind Speed
    const currentWindSpeed = weatherTemplateClone.content.querySelector('.current-wind-speed-value');
    currentWindSpeed.innerText = Math.round(weatherData.current.wind_speed * 3.6);
    currentWindSpeed.parentNode.setAttribute('onclick', `triggerToast("Windspeed", "${Math.round(weatherData.current.wind_speed * 3.6)} km/h | ${getWindForce(weatherData.current.wind_speed).beaufort} (${getWindForce(weatherData.current.wind_speed).description})")`);

    // Pressure
    const currentPressure = weatherTemplateClone.content.querySelector('.current-pressure-value');
    currentPressure.innerText = weatherData.current.pressure;
    currentPressure.parentNode.setAttribute('onclick', 'triggerToast("Pressure", "' + weatherData.current.pressure + ' hPa")');

    // Humidity
    const currentHumidity = weatherTemplateClone.content.querySelector('.current-humidity-value');
    currentHumidity.innerText = weatherData.current.humidity;
    currentHumidity.parentNode.setAttribute('onclick', 'triggerToast("Humidity", "' + weatherData.current.humidity + ' %")');

    // Propertiy of precipitation
    const currentPop = weatherTemplateClone.content.querySelector('.current-pop-value');
    currentPop.innerText = Math.round(weatherData.hourly[0].pop * 100);

    if (weatherData.hourly[0].rain) {
        let rainVolume = 1000 * 1000 * weatherData.hourly[0].rain["1h"] / 1000000;
        currentPop.parentNode.setAttribute('onclick', 'triggerToast("Rain", "' + Math.round(weatherData.hourly[0].pop * 100) + ' % | ' + rainVolume + ' l/m²")');
    } else if (weatherData.hourly[0].snow) {
        currentPop.parentNode.setAttribute('onclick', 'triggerToast("Snow", "' + Math.round(weatherData.hourly[0].pop * 100) + ' % | ' + weatherData.hourly[0].snow["1h"] + ' mm")');
    } else {
        currentPop.parentNode.setAttribute('onclick', 'triggerToast("Probability of precipitation", "' + Math.round(weatherData.hourly[0].pop * 100) + ' %")');
    }

    // UV Index
    const currentUvIndex = weatherTemplateClone.content.querySelector('.current-uvindex-value');
    currentUvIndex.innerText = weatherData.current.uvi;
    currentUvIndex.parentNode.setAttribute('onclick', 'triggerToast("UV Index", "' + weatherData.current.uvi + ' | ' + getUvIndexDescription(weatherData.current.uvi) + '")');

    // Map
    const currentWeatherMap = weatherTemplateClone.content.querySelector('#map');
    currentWeatherMap.id = `${weatherData.lat}-${weatherData.lon}-map`;

    // Set hourly weather data
    const hourlyWeatherList = weatherTemplateClone.content.querySelector('.hourly-weather-list');

    for (let i = 1; i < 25; i++) {
        const hourlyWeatherItem = weatherTemplateClone.content.querySelector('.hourly-weather-item');
        const hourlyWeatherItemClone = hourlyWeatherItem.cloneNode(true);

        // Hourly Weather Icon
        const hourlyWeatherIcon = hourlyWeatherItemClone.querySelector('.hourly-weather-item img');
        hourlyWeatherIcon.setAttribute('src', 'images/icons/' + setWeatherMedia(weatherData.hourly[i].weather[0], 'svg') + '.svg');

        // Hourly Temperature
        const hourlyTemperature = hourlyWeatherItemClone.querySelector('.hourly-temperature');
        hourlyTemperature.innerText = Math.round(weatherData.hourly[i].temp);

        // Time
        const hourlyTimestamp = hourlyWeatherItemClone.querySelector('.hourly-timestamp');
        hourlyTimestamp.innerText = getHoursAndMinutes(weatherData.hourly[i].dt, weatherData.timezone_offset)

        // Add toast
        let toastTitle = getHoursAndMinutes(weatherData.hourly[i].dt, weatherData.timezone_offset) // Time
        let toastDescription = weatherData.hourly[i].weather[0].description + ' | ' + Math.round(weatherData.hourly[i].temp) + '°'; // Weather description + temperature
        hourlyWeatherItemClone.setAttribute('onclick', 'triggerToast("' + toastTitle + '", "' + toastDescription + '")');

        // Add to template clone
        hourlyWeatherList.appendChild(hourlyWeatherItemClone, true);
    }

    // Set daily weather data
    const dailyWeatherList = weatherTemplateClone.content.querySelector('.daily-weather-list');

    for (let i = 1; i < 8; i++) {
        const dailyWeatherItem = weatherTemplateClone.content.querySelector('.daily-weather-item');
        const dailyWeatherItemClone = dailyWeatherItem.cloneNode(true);

        // Daily Day & Date
        const dailyDay = dailyWeatherItemClone.querySelector('.daily-day');
        const dailyDate = dailyWeatherItemClone.querySelector('.daily-date');
        dailyDay.innerText = getDay(weatherData.daily[i].dt, weatherData.timezone_offset);
        dailyDate.innerText = getDate(weatherData.daily[i].dt, weatherData.timezone_offset);

        // Daily Icon
        const dailyWeatherIcon = dailyWeatherItemClone.querySelector('.daily-weather-item img');
        dailyWeatherIcon.setAttribute('src', 'images/icons/' + setWeatherMedia(weatherData.daily[i].weather[0], 'svg') + '.svg');

        // Daily Temperature
        const dailyTemperature = dailyWeatherItemClone.querySelector('.daily-temperature');
        dailyTemperature.innerText = Math.round(weatherData.daily[i].temp.day);

        const dailyTemperatureMax = dailyWeatherItemClone.querySelector('.daily-temperature-max');
        dailyTemperatureMax.innerText = Math.round(weatherData.daily[i].temp.max);

        const dailyTemperatureMin = dailyWeatherItemClone.querySelector('.daily-temperature-min');
        dailyTemperatureMin.innerText = Math.round(weatherData.daily[i].temp.min);

        // POP
        const dailyPop = dailyWeatherItemClone.querySelector('.daily-pop');
        dailyPop.innerText = `${Math.round(weatherData.daily[i].pop * 100)} %`;

        // Wind
        const dailyWind = dailyWeatherItemClone.querySelector('.daily-wind');
        dailyWind.innerText = `${Math.round(weatherData.daily[i].wind_speed * 3.6)} km/h`;

        // Add toast
        let toastTitle = getDay(weatherData.daily[i].dt, weatherData.timezone_offset); // Day
        let toastDescription = weatherData.daily[i].weather[0].description + ' | ' + Math.round(weatherData.daily[i].temp.day) + '°'; // Weather description + temperature
        dailyWeatherItemClone.setAttribute('onclick', 'triggerToast("' + toastTitle + '", "' + toastDescription + '")');

        // Add to template clone
        dailyWeatherList.appendChild(dailyWeatherItemClone, true);
    }

    // Add weather alerts if avaiable
    if (weatherData.alerts) {
        // Weather alert template
        const alertTemplate = document.querySelector('#alert-template');
        let alertTemplateClone = alertTemplate.cloneNode(true);

        // Set alert value
        const alertValue = alertTemplateClone.content.querySelector('.alert-value');
        alertValue.innerText = weatherData.alerts[0].event;

        // Add clone to DOM
        weatherTemplateClone.content.querySelector('section.current-weather').insertBefore(alertTemplateClone.content.querySelector('.weather-alert'), weatherTemplateClone.content.querySelector('.current-weather-data'));
    }

    // Add clone to DOM
    document.querySelector('main').appendChild(weatherTemplateClone.content.querySelector('article'), true);

    // Render map
    weatherData.current.rain || weatherData.hourly[0].pop > 0.75 ? setMap(currentWeatherMap.id, weatherData.lat, weatherData.lon, true) : setMap(currentWeatherMap.id, weatherData.lat, weatherData.lon, false);
}

/* -------------------- Trigger PWA install popup -------------------- */

triggerPwaPopUp();