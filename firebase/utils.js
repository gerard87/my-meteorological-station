function round (number) {
    let num = Number(number).toFixed(1);
    let sp_num = num.split(".");
    return sp_num.pop() === '0' ? sp_num[0] : num;
}

module.exports = {
    round
};