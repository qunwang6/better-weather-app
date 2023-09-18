export function getHoursAndMinutes(timestamp, offset) {
    let date = new Date((timestamp + offset) * 1000);
    let hours = date.getUTCHours() < 10 ? '0' + date.getUTCHours() : date.getUTCHours();
    let mins = date.getUTCMinutes() < 10 ? '0' + date.getUTCMinutes() : date.getUTCMinutes();
    return hours + ':' + mins;
}

export function getDate(timestamp, offset) {
    let date = new Date((timestamp + offset) * 1000);
    let day = date.getUTCDate() < 10 ? '0' + date.getUTCDate() : date.getUTCDate();

    let month = date.getUTCMonth() + 1
    month = month < 10 ? '0' + month : month;
    return day + '.' + month + '.';
}

export function getDay(timestamp, offset) {
    let date = new Date((timestamp + offset) * 1000);
    let day = date.getUTCDay();

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