function normalizeName (name) {
    return capitalizeFirstLetter(name.replace(/\s+/g, ''));
}

function capitalizeFirstLetter (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function uncapitalizeFirstLetter (string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function getKeyAndUnit (value) {
    let valueId = ' ';
    let measureUnit = '';

    const val = uncapitalizeFirstLetter(value);

    switch (val) {
        case 'temperature':
            valueId = val;
            measureUnit = ' centigrade degrees';
            break;
        case 'city':
        case 'weather':
            valueId = val;
            break;
        case 'humidity':
            valueId = val;
            measureUnit = ' %';
            break;
        case 'pressure':
            valueId = val;
            measureUnit = ' Pa';
            break;
        case 'sea level pressure':
            valueId = 'sealevel_pressure';
            measureUnit = ' Pa';
            break;
        case 'altitude':
            valueId = val;
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