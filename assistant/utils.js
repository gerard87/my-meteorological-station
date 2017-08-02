function normalizeName (name) {
    return capitalizeFirstLetter(name.replace(/\s+/g, ''));
}

function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getKeyAndUnit (value) {
    let valueId = ' ';
    let measureUnit = '';
    switch (value) {
        case 'temperature':
            valueId = value;
            measureUnit = ' centigrade degrees';
            break;
        case 'city':
        case 'weather':
            valueId = value;
            break;
        case 'humidity':
            valueId = value;
            measureUnit = ' %';
            break;
        case 'pressure':
            valueId = value;
            measureUnit = ' Pa';
            break;
        case 'sea level pressure':
            valueId = 'sealevel_pressure';
            measureUnit = ' Pa';
            break;
        case 'altitude':
            valueId = value;
            measureUnit = ' m';
            break;
        case 'wind velocity':
            valueId = 'wind_kph';
            measureUnit = ' kph';
            break;
    }
    return {
        valueId: valueId,
        measureUnit: measureUnit
    }
}

module.exports = {
    normalizeName,
    getKeyAndUnit
};