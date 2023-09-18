export function setWeatherMedia(weather, filetype) {
    if (filetype === 'mp4') {
        // clear sky
        if (weather.icon === '01d') {
            return 'clear-sky-day';
        }
        if (weather.icon === '01n') {
            return 'clear-sky-night';
        }

        // few clouds
        if (weather.icon === '02d') {
            return 'few-clouds-day';
        }
        if (weather.icon === '02n') {
            return 'few-clouds-night';
        }

        // scattered clouds
        if (weather.icon === '03d' || weather.icon === '03n') {
            return 'cloud';
        }

        // broken clouds
        if (weather.icon === '04d' || weather.icon === '04n') {
            return 'clouds';
        }

        // rain
        if (weather.icon === '09d' || weather.icon === '09n' || weather.icon === '10d' || weather.icon === '10n') {
            return 'rain';
        }

        // thunderstorm
        if (weather.icon === '11d' || weather.icon === '11n') {
            return 'thunderstorm';
        }

        // snow
        if (weather.icon === '13d' || weather.icon === '13n') {
            return 'snow';
        }

        // mist
        if (weather.icon === '50d' || weather.icon === '50n') {
            return 'mist';
        }
    }

    if (filetype === 'svg') {
        if (['01d', '01n', '02d', '02n'].includes(weather.icon)) {
            if (weather.icon === '01d') {
                return 'clear-sky-day';
            }

            if (weather.icon === '01n') {
                return 'clear-sky-night';
            }

            if (weather.icon === '02d') {
                return 'few-clouds-day';
            }

            if (weather.icon === '02n') {
                return 'few-clouds-night';
            }
        } else {
            // thunderstorm
            if ([200, 201, 202, 210, 211, 212, 221, 230, 231, 232].includes(weather.id)) {
                return 'thunderstorm';
            }

            // drizzle
            if ([300, 301, 302, 310, 311, 312, 313, 314, 221].includes(weather.id)) {
                return 'drizzle';
            }

            // light-rain
            if ([500, 501].includes(weather.id)) {
                return 'light-rain';
            }

            // heavy-rain
            if ([502, 503, 504, 520, 521, 522, 531].includes(weather.id)) {
                return 'light-rain';
            }

            // snow-rain
            if ([511, 615, 616,].includes(weather.id)) {
                return 'snow-rain';
            }

            // light-snow
            if ([600, 612, 620].includes(weather.id)) {
                return 'light-snow';
            }

            // snow
            if ([601, 613, 621].includes(weather.id)) {
                return 'snow';
            }

            // heavy-snow
            if ([602, 611, 622].includes(weather.id)) {
                return 'heavy-snow';
            }

            // fog, mist
            if ([701, 721, 741].includes(weather.id)) {
                return 'fog';
            }

            // smoke, dust
            if ([711, 731, 751, 761, 762].includes(weather.id)) {
                return 'smoke';
            }

            // sqalls
            if ([771].includes(weather.id)) {
                return 'wind';
            }

            // tornado
            if ([781].includes(weather.id)) {
                return 'tornado';
            }

            // scattered clouds
            if (weather.id === 802) {
                return 'cloud';
            }

            // broken clouds
            if ([803, 804].includes(weather.id)) {
                return 'clouds';
            }
        }
    }
}