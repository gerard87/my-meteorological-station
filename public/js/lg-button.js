$(function () {
    $('#lg-btn').on('click', function (event) {
        var stop = false;
        if($('#lg-btn').text() === 'Send to Liquid Galaxy'){
            $('#lg-btn').text('Stop Liquid Galaxy');
            $('#lg-btn').attr('class', 'btn btn-danger');
        } else {
            $('#lg-btn').text('Send to Liquid Galaxy');
            $('#lg-btn').attr('class', 'btn btn-primary');
            stop = true;
        }
        $.ajax({
            type: "POST",
            url: '/lg',
            data: {
                'city': $('#city').text(),
                'stop': stop
            }
        });
    });
});