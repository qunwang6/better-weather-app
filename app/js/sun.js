// Mapping values to percentage

export function mapPercentageValue(min, max, value) {
    if (value <= max && value >= min) {
        return Math.round(100 / (max - min) * (value - min));
    } else {
        return 0;
    }
}

// Convert UV Index into human readable values

export function getUvIndexDescription(uvindex) {
    uvindex = Math.round(uvindex);

    if (uvindex >= 0 && uvindex <= 2) {
        return 'Low';
    }

    if (uvindex >= 3 && uvindex <= 5) {
        return 'Moderate';
    }

    if (uvindex >= 6 && uvindex <= 7) {
        return 'High';
    }

    if (uvindex >= 8 && uvindex <= 10) {
        return 'Very High';
    }

    if (uvindex > 11) {
        return 'Extreme';
    }
}