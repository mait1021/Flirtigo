function getZodiac(birthmonth, birthday) {
  let result = "";
  if ((birthmonth == 01 && birthday >= 20) || (birthmonth == 02 && birthday <= 18)) {
    result = "Aquarius";
  }
  if ((birthmonth == 2 && birthday >= 19) || (birthmonth == 3 && birthday <= 20)) {
    result = "Pisces";
  }
  if ((birthmonth == 3 && birthday >= 21) || (birthmonth == 4 && birthday <= 19)) {
    result = "Aries";
  }
  if ((birthmonth == 4 && birthday >= 20) || (birthmonth == 5 && birthday <= 20)) {
    result = "Taurus";
  }
  if ((birthmonth == 5 && birthday >= 21) || (birthmonth == 6 && birthday <= 20)) {
    result = "Gemini";
  }
  if ((birthmonth == 6 && birthday >= 21) || (birthmonth == 7 && birthday <= 22)) {
    result = "Cancer";
  }
  if ((birthmonth == 7 && birthday >= 23) || (birthmonth == 8 && birthday <= 22)) {
    result = "Leo";
  }
  if ((birthmonth == 8 && birthday >= 23) || (birthmonth == 9 && birthday <= 22)) {
    result = "Virgo";
  }
  if ((birthmonth == 9 && birthday >= 23) || (birthmonth == 10 && birthday <= 22)) {
    result = "Libra";
  }
  if ((birthmonth == 10 && birthday >= 23) || (birthmonth == 11 && birthday <= 21)) {
    result = "Scorpio";
  }
  if ((birthmonth == 11 && birthday >= 22) || (birthmonth == 12 && birthday <= 21)) {
    result = "Sagittarius";
  }
  if ((birthmonth == 12 && birthday >= 22) || (birthmonth == 1 && birthday <= 19)) {
    result = "Capricorn";
  }
  return result;
}

$(document).ready(function () {
  console.log("ready!");
  $("#birthday").on("change", function () {
    let birth = $(this).val();
    let birthArr = birth.split("-");
    let birthMonth = birthArr[1];
    let birthday = birthArr[2];
    const result = getZodiac(birthMonth, birthday);

    $(".zodiac").empty();
    console.log("");
    if (result) {
      console.log("result", result);
      $(".zodiac").prepend("<img src='https://www.horoscope.com/images-US/signs/profile-" + result.toLocaleLowerCase() + ".png'width=20%>");
      $(".zodiac").prepend("<p>" + result + "</p>");
    } else if (birthmonth > 12 || birthday > 31) {
      alert("Please enter an accurate date ! "); 
    } else {
      $(".zodiac").prepend("<p>Let's find your zodiac</p>");
    }
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
showSlides(slideIndex);

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

//matchTab-buttons change color onclick
matchTab();
