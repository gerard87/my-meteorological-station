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

module.exports = {
    round,
    getIconName
};