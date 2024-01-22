function showInfo(){
    var x = document.getElementById("div-information");
    if (x.style.display == "flex") {
        x.style.display = "none";
    } 
    else {
        x.style.display = "flex";
    }};

function updateTextInput(val) {
      document.getElementById('Noisyinput').value=val; 
      };