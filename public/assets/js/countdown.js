$(function () {


    /* =========================================
        COUNTDOWN 1
     ========================================= */
    $('#clock').countdown('2020/1/1').on('update.countdown', function(event) {
      var $this = $(this).html(event.strftime(''
        + '<span class="h1 font-weight-bold">%D</span> Dni'
        + '<span class="h1 font-weight-bold">%H</span> Godzin'
        + '<span class="h1 font-weight-bold">%M</span> Minut'
        + '<span class="h1 font-weight-bold">%S</span> Sekund'));
    });

    $('#clock-2').countdown('2020/1/1').on('update.countdown', function(event) {
        var $this = $(this).html(event.strftime(''
          + '<span class="h1 font-weight-bold">%D</span> Dni'
          + '<span class="h1 font-weight-bold">%H</span> Godzin'
          + '<span class="h1 font-weight-bold">%M</span> Minut'
          + '<span class="h1 font-weight-bold">%S</span> Sekund'));
      });

      $('#clock-4').countdown('2020/1/1').on('update.countdown', function(event) {
        var $this = $(this).html(event.strftime(''
          + '<span class="h1 font-weight-bold">%D</span> Dni'
          + '<span class="h1 font-weight-bold">%H</span> Godzin'
          + '<span class="h1 font-weight-bold">%M</span> Minut'
          + '<span class="h1 font-weight-bold">%S</span> Sekund'));
      });
    /* =========================================
        COUNTDOWN 2
     ========================================= */
    $('#clock-a').countdown('2020/1/1').on('update.countdown', function(event) {
      var $this = $(this).html(event.strftime(''
        + '<span class="h1 font-weight-bold">%w</span> week%!w'
        + '<span class="h1 font-weight-bold">%D</span> Days'));
    });

    /* =========================================
        COUNTDOWN 3
     ========================================= */
    $('#clock-b').countdown('2020/1/1').on('update.countdown', function(event) {
      var $this = $(this).html(event.strftime(''
        + '<div class="holder m-2"><span class="h1 font-weight-bold">%D</span> Dni</div>'
        + '<div class="holder m-2"><span class="h1 font-weight-bold">%H</span> Godzin</div>'
        + '<div class="holder m-2"><span class="h1 font-weight-bold">%M</span> Minut</div>'
        + '<div class="holder m-2"><span class="h1 font-weight-bold">%S</span> Sekund</div>'));
    });


    /* =========================================
        COUNTDOWN 4
     ========================================= */
    function get15dayFromNow() {
        return new Date(new Date().valueOf() + 15 * 24 * 60 * 60 * 1000);
    }

    $('#clock-c').countdown(get15dayFromNow(), function(event) {
      var $this = $(this).html(event.strftime(''
        + '<span class="h1 font-weight-bold">%D</span> Day%!d'
        + '<span class="h1 font-weight-bold">%H</span> Hr'
        + '<span class="h1 font-weight-bold">%M</span> Min'
        + '<span class="h1 font-weight-bold">%S</span> Sec'));
    });

    /* =========================================
        CALL TO ACTIONS FOR COUNTDOWN 4
     ========================================= */
    $('#btn-reset').click(function() {
        $('#clock-c').countdown(get15dayFromNow());
    });
    $('#btn-pause').click(function() {
        $('#clock-c').countdown('pause');
    });
    $('#btn-resume').click(function() {
        $('#clock-c').countdown('resume');
    });

});

