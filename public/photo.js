function initImageUpload(box) {
  let uploadField = box.querySelector(".image-upload");

  uploadField.addEventListener("change", getFile);

  function getFile(e) {
    let file = e.currentTarget.files[0];
    checkType(file);
  }

  function previewImage(file) {
    let thumb = box.querySelector(".image-preview"),
      reader = new FileReader();

    reader.onload = function () {
      thumb.style.backgroundImage = "url(" + reader.result + ")";
    };
    reader.readAsDataURL(file);
    thumb.className += " js--no-default";
  }

  function checkType(file) {
    let imageType = /image.*/;
    if (!file) {
      throw "No file";
    } else {
      previewImage(file);
    }
  }
}

// initialize box-scope
var boxes = document.querySelectorAll(".box");

for (let i = 0; i < boxes.length; i++) {
  let box = boxes[i];
  initImageUpload(box);
}
