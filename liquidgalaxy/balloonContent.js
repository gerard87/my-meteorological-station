function getContent (data) {
    return '<link rel="stylesheet" href="https://code.getmdl.io/1.3.0/material.blue_grey-red.min.css"/>' +
        '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:regular,bold,italic,thin,light,bolditalic,black,medium&lang=en"/>' +
        '<table width="470" style="font-family: Roboto;"><tr><td>' +
        '<div id="content">'+'<div id="siteNotice">'+'</div>' +
        '<h1 id="firstHeading" class="firstHeading" style="color: #474747;font-size: 1.5em;line-height:0.2;text-align:center">My meteorological station</h1>' +
        '<h1 id="firstHeading" class="firstHeading" style="color: #474747;font-size: 2em;line-height:1;text-align:center">' + data.name + '</h1>' +
        '<div id="bodyContent" style="text-align: center;">' +

        '<div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-grid" style="width: 98%">'+

        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:2.5em;color:#474747;line-height:1;">'+data.city+'</p>' +
        '<p style="font-size:3.5em;color:#474747;line-height:1;">'+data.temperature+' ºC</p>' +
        '<p style="font-size:1.5em;color:#474747;line-height:1;">Feels like '+data.feelslike_c+' ºC</p>' +

        '</div>' +
        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer" style="text-align: center;">' +

        '<img src="/img/'+data.icon_img+'.png" height="96" width="96"/>' +
        '<p style="font-size:1.5em;color:#474747;">'+data.weather+'</p>' +

        '</div>' +

        '</div>' +


        '<div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-grid" style="width: 98%">'+

        '<div class="mdl-cell mdl-cell--6-col mdl-layout-spacer" style="text-align: left;">' +
        '<img src="/img/rpi-logo.png" height="32" width="32"/>' +
        '</div>' +

        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Humidity:</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.humidity+' %</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Pressure:</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.pressure+' Pa</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Sealevel pressure:</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.sealevel_pressure+' Pa</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Altitude:</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.altitude+' m</p>' +
        '</div>' +

        '</div>' +


        '<div class="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--6-col mdl-grid" style="width: 98%">'+

        '<div class="mdl-cell mdl-cell--6-col mdl-layout-spacer" style="text-align: left;">' +
        '<img src="/img/wunderground-logo.jpg" height="22" width="40"/>' +
        '</div>' +

        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Wind velocity:</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.wind_kph+' kph</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Wind direction:</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.wind_dir+' </p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Precipitation (daily):</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.precip_today_metric+' mm</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Visibility:</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.visibility_km+' km</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Dewpoint:</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.dewpoint_c+' ºC</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">Heat index:</p>' +
        '</div>' +


        '<div class="mdl-cell mdl-cell--3-col mdl-layout-spacer">' +
        '<p style="font-size:1.5em;color:#474747;line-height:0.5;">'+data.heat_index_c+' ºC</p>' +
        '</div>' +

        '</div>' +



        '</div></div>' +
        '</td></tr></table>';
}




module.exports = {
    getContent
};