

// Convert wind data in m/s to beaufort scale and description

export function getWindForce(windspeed) {
    windspeed = Math.round(windspeed);

    if (windspeed === 0) {
        return {
            beaufort: 0,
            description: 'Calm'
        };
    }

    if (windspeed === 1) {
        return {
            beaufort: 1,
            description: 'Light air'
        };
    }

    if (windspeed >= 2 && windspeed <= 3) {
        return {
            beaufort: 2,
            description: 'Light breeze'
        };
    }

    if (windspeed >= 4 && windspeed <= 5) {
        return {
            beaufort: 3,
            description: 'Gentle breeze'
        };
    }

    if (windspeed >= 6 && windspeed <= 7) {
        return {
            beaufort: 4,
            description: 'Moderate breeze'
        };
    }

    if (windspeed >= 8 && windspeed <= 10) {
        return {
            beaufort: 5,
            description: 'Fresh breeze'
        };
    }

    if (windspeed >= 11 && windspeed <= 13) {
        return {
            beaufort: 6,
            description: 'Strong breeze'
        };
    }

    if (windspeed >= 14 && windspeed <= 17) {
        return {
            beaufort: 7,
            description: 'Moderate gale'
        };
    }

    if (windspeed >= 18 && windspeed <= 20) {
        return {
            beaufort: 8,
            description: 'Fresh gale'
        };
    }

    if (windspeed >= 21 && windspeed <= 24) {
        return {
            beaufort: 9,
            description: 'Strong gale'
        };
    }

    if (windspeed >= 25 && windspeed <= 28) {
        return {
            beaufort: 10,
            description: 'Storm'
        };
    }

    if (windspeed >= 29 && windspeed <= 32) {
        return {
            beaufort: 11,
            description: 'Violent storm'
        };
    }

    if (windspeed >33) {
        return {
            beaufort: 12,
            description: 'Hurricane'
        };
    }
}

// Get compass direction

export function setWindDirection(degrees) {
    const step = 11.25;

    // North
    if ((degrees >= (0 - step) && degrees < (0 + step)) || degrees >= (360 - step)) {
        return 'N';
    }

    // North-North-East
    if (degrees > (22.5 - step) && degrees < (22.5 + step)) {
        return 'NNE';
    }

    // North-East
    if (degrees > (45 - step) && degrees < (45 + step)) {
        return 'NE';
    }

    // East-North-East
    if (degrees > (67.5 - step) && degrees < (67.5 + step)) {
        return 'ENE';
    }

    // East
    if (degrees > (90 - step) && degrees < (90 + step)) {
        return 'E';
    }

    // East-South-East
    if (degrees > (112.5 - step) && degrees < (112.5 + step)) {
        return 'ESE';
    }

    // South-East
    if (degrees > (135 - step) && degrees < (135 + step)) {
        return 'SE';
    }

    // South-South-East
    if (degrees > (157.5 - step) && degrees < (157.5 + step)) {
        return 'SSE';
    }

    // South
    if (degrees > (180 - step) && degrees < (180 + step)) {
        return 'S';
    }

    // South-South-West
    if (degrees > (202.5 - step) && degrees < (202.5 + step)) {
        return 'SSW';
    }

    // South-West
    if (degrees > (225 - step) && degrees < (225 + step)) {
        return 'SW';
    }

    // West-South-West
    if (degrees > (247.5 - step) && degrees < (247.5 + step)) {
        return 'WSW';
    }

    // West
    if (degrees > (270 - step) && degrees < (270 + step)) {
        return 'W';
    }

    // West-North-West
    if (degrees > (292.5 - step) && degrees < (292.5 + step)) {
        return 'WNW';
    }

    // North-West
    if (degrees > (315 - step) && degrees < (315 + step)) {
        return 'NW';
    }

    // North-North-West
    if (degrees > (337.5 - step) && degrees <= (337.5 + step)) {
        return 'NNW';
    }
}