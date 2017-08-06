function round (number) {
    let num = Number(number).toFixed(1);
    let sp_num = num.split(".");
    return sp_num.pop() === '0' ? sp_num[0] : num;
}

function getIconName (icon) {
    return icon === 'flurries' || icon === 'chanceflurries' || icon === 'chancesleet' ? 'sleet' :
        icon === 'chancerain' ? 'rain' : icon === 'chancesnow' ? 'snow' :
            icon === 'chancetstorms' ? 'tstorms' : icon === 'clear' || icon === 'hazy' ? 'sunny' :
                icon === 'mostlycloudy' || icon === 'mostlysunny' || icon === 'partlysunny' ? 'partlycloudy': icon;
}

function getDirection (dir) {

    let direction;
    let grades;

    switch (dir) {
        case 'North':
            direction = dir;
            grades = 0;
            break;

        case 'NNE':
            direction = 'North-northeast';
            grades = 22.5;
            break;

        case 'NE':
            direction = 'Northeast';
            grades = 45;
            break;

        case 'ENE':
            direction = 'East-northeast';
            grades = 67.5;
            break;

        case 'East':
            direction = dir;
            grades = 90;
            break;

        case 'ESE':
            direction = 'East-southeast';
            grades = 112.5;
            break;

        case 'SE':
            direction = 'Southeast';
            grades = 135;
            break;

        case 'SSE':
            direction = 'South-southeast';
            grades = 157.5;
            break;

        case 'South':
            direction = dir;
            grades = 180;
            break;

        case 'SSW':
            direction = 'South-southwest';
            grades = 202.5;
            break;

        case 'SW':
            direction = 'Southwest';
            grades = 225;
            break;

        case 'WSW':
            direction = 'West-southwest';
            grades = 247.5;
            break;

        case 'West':
            direction = dir;
            grades = 270;
            break;

        case 'WNW':
            direction = 'West-northwest';
            grades = 292.5;
            break;

        case 'NW':
            direction = 'Northwest';
            grades = 315;
            break;

        case 'NNW':
            direction = 'North-northwest';
            grades = 337.5;
            break;

        default:
            direction = dir;
            grades = 0;
    }

    return {
        direction: direction,
        grades: grades
    }
}

function getWindIcon (vel) {
    if(vel < 3) {
        return 'wind-low'
    } else if (vel >= 3 && vel < 10) {
        return 'wind-normal'
    } else if (vel >= 10) {
        return 'wind-high'
    }

}

module.exports = {
    round,
    getIconName,
    getDirection,
    getWindIcon
};