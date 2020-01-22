$("#button").on("click", function(e) {
  addToWebinarNewsletter("#email", "#button");
});

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function addToWebinarNewsletter(input, button) {
  var emailFieldValue = $(input).val();
  if (validateEmail(emailFieldValue)) {
    console.log("Valid email");
    $(input).attr('style', 'border: 0px solid red;')
    $(button).text("Przygotowuję dla Ciebie link...");
    createOrUpdateContact(emailFieldValue, button);
  } else {
    console.log("Invalid email");
    $(input).attr('style', 'border: 2px solid red;')
    $.notify(
      {
        icon: "fa fa-exclamation",
        message: "Niepoprawny format adresu email."
      },
      {
        delay: 6000,
        type: "warning",
        template:
          '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
          '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
          '<span data-notify="icon"></span> ' +
          '<span data-notify="message">{2}</span>' +
          '<div class="progress" data-notify="progressbar">' +
          '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
          "</div>" +
          '<a href="{3}" target="{4}" data-notify="url"></a>' +
          "</div>"
      }
    );
  }
}

function createOrUpdateContact(emailFieldValue, button) {
  var apiUrl = "https://pacific-lowlands-81394.herokuapp.com/createorupdatecontactseleniumwebdriverhomework"; // get this from settings

  var contact = {
    contact: {
      email: emailFieldValue,
      firstName: "",
      lastName: "",
      phone: ""
    }
  };

  console.log(JSON.stringify(contact));
  $.ajax({
    url: apiUrl,
    type: "post",
    dataType: "json",
    contentType: "application/json",
    data: JSON.stringify(contact),
    dataType: "json",
    success: function(data) {
      console.info(data);
      $(button).val("Wyślij ponownie");
      $.notify(
        {
          icon: "fa fa-check",
          message: "Wysłano, dziękuje za Twój email. :)"
        },
        {
          delay: 6000,
          type: "success",
          template:
            '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            "</div>" +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            "</div>"
        }
      );
      window.location.href = "selenium-zadanie-rekrutacyjne-dziekuje.html";
    },
    error: function(request, status, error) {
      console.info(request, status, error);
      $(button).val("Nie wysłano");
      console.error("Error adding document: ");
      $.notify(
        {
          icon: "fa fa-exclamation",
          message:
            "Problem z wysłaniem, odśwież proszę stronę. Jeżeli problem się" +
            " powtórzy skontaktuj się z administratorem: kontakt@marcinstanek.pl"
        },
        {
          delay: 6000,
          type: "danger",
          template:
            '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
            '<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
            '<span data-notify="icon"></span> ' +
            '<span data-notify="message">{2}</span>' +
            '<div class="progress" data-notify="progressbar">' +
            '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
            "</div>" +
            '<a href="{3}" target="{4}" data-notify="url"></a>' +
            "</div>"
        }
      );
    }
  });
}