$(document).ready(function () {
  console.log("ready!");
  $("#birthday").on("change", function () {
    let birth = $(this).val();
    let birthArr = birth.split("-");
    let birthmonth = birthArr[1];
    let birthday = birthArr[2];
    let result = "Let's find your zodiac";

    if (
      (birthmonth == 01 && birthday >= 20) ||
      (birthmonth == 02 && birthday <= 18)
    ) {
      result = "Aquarius";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-aquarius.svg'>"
      );
    }

    if (
      (birthmonth == 2 && birthday >= 19) ||
      (birthmonth == 3 && birthday <= 20)
    ) {
      result = "Pisces";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-Pisces.svg'>"
      );
    }

    if (
      (birthmonth == 3 && birthday >= 21) ||
      (birthmonth == 4 && birthday <= 19)
    ) {
      result = "Aries";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-Aries.svg'>"
      );
    }

    if (
      (birthmonth == 4 && birthday >= 20) ||
      (birthmonth == 5 && birthday <= 20)
    ) {
      result = "Taurus";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-Taurus.svg'>"
      );
    }

    if (
      (birthmonth == 5 && birthday >= 21) ||
      (birthmonth == 6 && birthday <= 20)
    ) {
      result = "Gemini";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-Gemini.svg'>"
      );
    }

    if (
      (birthmonth == 6 && birthday >= 21) ||
      (birthmonth == 7 && birthday <= 22)
    ) {
      result = "Cancer";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-Cancer.svg'>"
      );
    }

    if (
      (birthmonth == 7 && birthday >= 23) ||
      (birthmonth == 8 && birthday <= 22)
    ) {
      result = "Leo";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-Leo.svg'>"
      );
    }

    if (
      (birthmonth == 8 && birthday >= 23) ||
      (birthmonth == 9 && birthday <= 22)
    ) {
      result = "Virgo";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-Virgo.svg'>"
      );
    }

    if (
      (birthmonth == 9 && birthday >= 23) ||
      (birthmonth == 10 && birthday <= 22)
    ) {
      result = "Libra";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-Libra.svg'>"
      );
    }

    if (
      (birthmonth == 10 && birthday >= 23) ||
      (birthmonth == 11 && birthday <= 21)
    ) {
      result = "Scorpio";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-Scorpio.svg'>"
      );
    }

    if (
      (birthmonth == 11 && birthday >= 22) ||
      (birthmonth == 12 && birthday <= 21)
    ) {
      result = "Sagittarius";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-Sagittarius.svg'>"
      );
    }
    if (
      (birthmonth == 12 && birthday >= 22) ||
      (birthmonth == 1 && birthday <= 19)
    ) {
      result = "Capricorn";
      $(".zodiac").empty();
      $(".zodiac").prepend(
        "<img src='../public/images/horoscope/profile-Capricorn.svg'>"
      );
    } else if (birthmonth > 12 || birthday > 31) {
      alert("Please enter an accurate date ! ");
    }
    $(".zodiac").prepend(
      `<input type='hidden' name='zodiac' value=${result}></input>`
    );
  });

  $(".photo").change(function () {
    console.log("hi");
    const file = this.files[0];
    if (file) {
      $("#photo-output").css("display", "block");
      let reader = new FileReader();
      reader.onload = function (event) {
        $("#photo-output").attr("src", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  });
});

// ------------
var slideIndex = 1;
// showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides((slideIndex += n));
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

//matchTab-buttons  onclick
function showMatch() {
  var x = document.getElementById("pageMatches");
  var y = document.getElementById("pageChat");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none";
  } else {
    x.style.display = "none";
  }
}

function showChat() {
  var x = document.getElementById("pageChat");
  var y = document.getElementById("pageMatches");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none";
  } else {
    x.style.display = "none";
  }
}

//chat_main: click on three dots, buttons shows

$(document).ready(function () {
  $(".dots").click(function () {
    $(".reportMatch").toggle();
  });

  $(".report").click(function () {
    $(".pageReport").show();
    $(".user-wrapper").hide();
  });

  $(".reportBtn a").click(function () {
    $(".overlay").hide();
    $(".user-wrapper").show();
  });
});

// function swipe() {
//   $(document).on("swipe", ".slideshow-container", function (event) {
//     console.log(event);
//     if (event.right == true) {
//       plusSlides(1);
//     }
//     if (results.left === true) {
//       plusSlides(-1);
//     }
//   });

//   // $(".slideshow-container").onSwipe(function (results) {
//   //   if (results.right === true) {
//   //     plusSlides(1);
//   //   }
//   //   if (results.left === true) {
//   //     plusSlides(-1);
//   //   }
//   // });
// }
