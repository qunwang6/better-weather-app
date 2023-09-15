/* -------------------- Handle Toast  -------------------- */

function triggerToast(title, description, type = 'info') {
    // Clone template
    const toastTemplate = document.querySelector('#toast-template');
    let toastTemplateClone = toastTemplate.cloneNode(true).content.querySelector('.toast');

    // Set title or icon
    if (type === 'info') {
        toastTemplateClone.classList.add('info')
        toastTemplateClone.querySelector('dl dt').innerHTML = '<img src="images/icons/info.svg" height="24" width="24" alt="Info icon" /> ' + title;
    } else if (type === 'warning') {
        toastTemplateClone.classList.add('warning')
        toastTemplateClone.querySelector('dl dt').innerHTML = '<img src="images/icons/warning.svg" height="24" width="24" alt="Warning icon" /> ' + title;
    } else if (type === 'error') {
        toastTemplateClone.classList.add('error')
        toastTemplateClone.querySelector('dl dt').innerHTML = '<img src="images/icons/error.svg" height="24" width="24" alt="Error icon" /> ' + title;
    } else {
        toastTemplateClone.querySelector('.toast dl dt').innerText = title;
    }

    toastTemplateClone.querySelector('dl dd').innerText = description;

    // Add toast to body
    document.querySelector('body').appendChild(toastTemplateClone, true);

    setTimeout(function () {
        document.querySelector('.toast').remove();
    }, 3500);
};

/* -------------------- Date / Time -------------------- */

function getHoursAndMinutes(timestamp, offset) {
    let date = new Date((timestamp + offset) * 1000);
    hours = date.getUTCHours() < 10 ? '0' + date.getUTCHours() : date.getUTCHours();
    mins = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes();
    return hours + ':' + mins;
}

function getDate(timestamp, offset) {
    let date = new Date((timestamp + offset) * 1000);
    day = date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate();

    let month = date.getUTCMonth() + 1
    month = month < 10 ? '0' + month : month;
    return day + '.' + month + '.';
}

function getDay(timestamp, offset) {
    let date = new Date((timestamp + offset) * 1000);
    day = date.getUTCDay();

    switch (day) {
        case 1:
            return 'Mon.';
        case 2:
            return 'Tue.';
        case 3:
            return 'Wed.';
        case 4:
            return 'Thu.';
        case 5:
            return 'Fri.';
        case 6:
            return 'Sat.';
        case 0:
            return 'Sun.';
    }
}

/* -------------------- Mapping values to percentage -------------------- */

function mapPercentageValue(min, max, value) {
    if (value <= max && value >= min) {
        return Math.round(100 / (max - min) * (value - min));
    } else {
        return 0;
    }
}

/* -------------------- Convert wind data -------------------- */

function getBeaufortScale(windspeed) {
    if (windspeed === 0) {
        return 0;
    }

    if (windspeed === 1) {
        return 1;
    }

    if (windspeed >= 2 && windspeed <= 3) {
        return 2;
    }

    if (windspeed >= 4 && windspeed <= 5) {
        return 3;
    }

    if (windspeed >= 6 && windspeed <= 7) {
        return 4;
    }

    if (windspeed >= 8 && windspeed <= 10) {
        return 5;
    }

    if (windspeed >= 11 && windspeed <= 13) {
        return 6;
    }

    if (windspeed >= 14 && windspeed <= 17) {
        return 7;
    }

    if (windspeed >= 18 && windspeed <= 20) {
        return 8;
    }

    if (windspeed >= 21 && windspeed <= 24) {
        return 9;
    }

    if (windspeed >= 25 && windspeed <= 28) {
        return 10;
    }

    if (windspeed >= 29 && windspeed <= 32) {
        return 11;
    }

    if (windspeed >33) {
        return 12;
    }
}

function setWindDirection(degrees, deg) {
    const step = 11.25;

    // North
    if ((degrees >= (0 - step) && degrees < (0 + step)) || degrees >= (360 - step)) {
        return deg ? degrees + '°' : 'N';
    }

    // North-North-East
    if (degrees > (22.5 - step) && degrees < (22.5 + step)) {
        return deg ? degrees + '°' : 'NNE';
    }

    // North-East
    if (degrees > (45 - step) && degrees < (45 + step)) {
        return deg ? degrees + '°' : 'NE';
    }

    // East-North-East
    if (degrees > (67.5 - step) && degrees < (67.5 + step)) {
        return deg ? degrees + '°' : 'ENE';
    }

    // East
    if (degrees > (90 - step) && degrees < (90 + step)) {
        return deg ? degrees + '°' : 'E';
    }

    // East-South-East
    if (degrees > (112.5 - step) && degrees < (112.5 + step)) {
        return deg ? degrees + '°' : 'ESE';
    }

    // South-East
    if (degrees > (135 - step) && degrees < (135 + step)) {
        return deg ? degrees + '°' : 'SE';
    }

    // South-South-East
    if (degrees > (157.5 - step) && degrees < (157.5 + step)) {
        return deg ? degrees + '°' : 'SSE';
    }

    // South
    if (degrees > (180 - step) && degrees < (180 + step)) {
        return deg ? degrees + '°' : 'S';
    }

    // South-South-West
    if (degrees > (202.5 - step) && degrees < (202.5 + step)) {
        return deg ? degrees + '°' : 'SSW';
    }

    // South-West
    if (degrees > (225 - step) && degrees < (225 + step)) {
        return deg ? degrees + '°' : 'SW';
    }

    // West-South-West
    if (degrees > (247.5 - step) && degrees < (247.5 + step)) {
        return deg ? degrees + '°' : 'WSW';
    }

    // West
    if (degrees > (270 - step) && degrees < (270 + step)) {
        return deg ? degrees + '°' : 'W';
    }

    // West-North-West
    if (degrees > (292.5 - step) && degrees < (292.5 + step)) {
        return deg ? degrees + '°' : 'WNW';
    }

    // North-West
    if (degrees > (315 - step) && degrees < (315 + step)) {
        return deg ? degrees + '°' : 'NW';
    }

    // North-North-West
    if (degrees > (337.5 - step) && degrees <= (337.5 + step)) {
        return deg ? degrees + '°' : 'NNW';
    }
}

/* -------------------- Get assets -------------------- */

function setWeatherMedia(weather, filetype) {
    if (filetype === 'mp4') {
        let videoName = '';

        // clear sky
        if (weather.icon === '01d') {
            videoName = 'clear-sky-day';
        }
        if (weather.icon === '01n') {
            videoName = 'clear-sky-night';
        }

        // few clouds
        if (weather.icon === '02d') {
            videoName = 'few-clouds-day';
        }
        if (weather.icon === '02n') {
            videoName = 'few-clouds-night';
        }

        // scattered clouds
        if (weather.icon === '03d' || weather.icon === '03n') {
            videoName = 'cloud';
        }

        // broken clouds
        if (weather.icon === '04d' || weather.icon === '04n') {
            videoName = 'clouds';
        }

        // rain
        if (weather.icon === '09d' || weather.icon === '09n' || weather.icon === '10d' || weather.icon === '10n') {
            videoName = 'rain';
        }

        // thunderstorm
        if (weather.icon === '11d' || weather.icon === '11n') {
            videoName = 'thunderstorm';
        }

        // snow
        if (weather.icon === '13d' || weather.icon === '13n') {
            videoName = 'snow';
        }

        // mist
        if (weather.icon === '50d' || weather.icon === '50n') {
            videoName = 'mist';
        }

        return videoName;
    }

    if (filetype === 'svg') {
        let iconName = '';

        if (['01d', '01n', '02d', '02n'].includes(weather.icon)) {
            if (weather.icon === '01d') {
                iconName = 'clear-sky-day';
            }

            if (weather.icon === '01n') {
                iconName = 'clear-sky-night';
            }

            if (weather.icon === '02d') {
                iconName = 'few-clouds-day';
            }

            if (weather.icon === '02n') {
                iconName = 'few-clouds-night';
            }
        } else {
            // thunderstorm
            if ([200, 201, 202, 210, 211, 212, 221, 230, 231, 232].includes(weather.id)) {
                iconName = 'thunderstorm';
            }

            // drizzle
            if ([300, 301, 302, 310, 311, 312, 313, 314, 221].includes(weather.id)) {
                iconName = 'drizzle';
            }

            // light-rain
            if ([500, 501].includes(weather.id)) {
                iconName = 'light-rain';
            }

            // heavy-rain
            if ([502, 503, 504, 520, 521, 522, 531].includes(weather.id)) {
                iconName = 'light-rain';
            }

            // snow-rain
            if ([511, 615, 616,].includes(weather.id)) {
                iconName = 'snow-rain';
            }

            // light-snow
            if ([600, 612, 620].includes(weather.id)) {
                iconName = 'light-snow';
            }

            // snow
            if ([601, 613, 621].includes(weather.id)) {
                iconName = 'snow';
            }

            // heavy-snow
            if ([602, 611, 622].includes(weather.id)) {
                iconName = 'heavy-snow';
            }

            // fog, mist
            if ([701, 721, 741].includes(weather.id)) {
                iconName = 'fog';
            }

            // smoke, dust
            if ([711, 731, 751, 761, 762].includes(weather.id)) {
                iconName = 'smoke';
            }

            // sqalls
            if ([771].includes(weather.id)) {
                iconName = 'wind';
            }

            // tornado
            if ([781].includes(weather.id)) {
                iconName = 'tornado';
            }

            // scattered clouds
            if (weather.id === 802) {
                iconName = 'cloud';
            }

            // broken clouds
            if ([803, 804].includes(weather.id)) {
                iconName = 'clouds';
            }
        }

        return iconName;
    }
}
