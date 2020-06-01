// Confirguation information for submitting form to Firebase
var config = {
  apiKey: "AIzaSyCsVANHYhX6PL4hpBb_tUWyNhXeaZe9m8s",
  authDomain: "shabbatograms.firebaseapp.com",
  databaseURL: "https://shabbatograms.firebaseio.com",
  storageBucket: "shabbatograms.appspot.com",
};

// Dictionary mapping camp names to donation links
var camp_dict = {"Camp Harlam":"https://campharlam.org/give/",
                 "Ramah Poconos":"https://www.ramahpoconos.org/giving/",
                 "Ramah Ojai":"https://ramah.org/donate/give/make-a-donation-2/"};

// An array containing all the camp names
var camps = Object.keys(camp_dict);


// Initialize Firebase app
firebase.initializeApp(config);

// Reference to the shabbatograms object in Firebase database
var grams = firebase.database().ref("shabbatograms");

// Save a new submission to the database, using the input in the form
var submitForm = function () {

  // Get input values from each of the form elements
  var id = Math.random().toFixed(10).substring(2,11);
  var shape = $("input[name='shape']:checked").val();
  var placement = $("input[name='placement']:checked").val();
  var color = $("input[name='color']:checked").val();
  var message_box = $("#message-box").val();
  var music = $("#music").val();
  var your_name = $("#your-name").val();
  var your_email = $("#your-email").val();
  var recipient_name = $("#recipient-name").val();
  var recipient_email = $("#recipient-email").val();
  var camp = $("#camp").val();

  // Push a new form to the database using those values
  grams.push({
    "id": id,
    "shape": shape,
    "placement": placement,
    "color": color,
    "message_box": message_box,
    "music": music,
    "your_name": your_name,
    "your_email": your_email,
    "recipient_name": recipient_name,
    "camp": camp
  });

  // Hide form  
  var form = document.getElementById('gram-form');
  form.style.display = "none";
  
  // Show post-submit box
  var post_submit = document.getElementById('post-submit');
  post_submit.style.display = "block";
  
  // Show message based on whether user wanted delivery time now or later
  var delivery = $("input[name='delivery-time']:check").val()
  var confirm = document.getElementById('confirm-' + delivery);
  confirm.style.display = "inline";
  
  // Get camp name
  var camp = document.getElementById('camp').value;
  
  // Check if user entered camp name
  if (camp != "") {

    // Show donation paragraph
    var donation = document.getElementById('donation');
    donation.style.display = "inline";
    
    // Input camp name
    var camp_name = document.getElementById('camp-name');
    camp_name.innerHTML = camp;
    
    // Input camp donation link
    var camp_link = document.getElementById('camp-link');
    camp_link.href = camp_dict[camp];
  }
};

// Handle autocomplete functionality for camp input
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

// Function to adjust gram display when shape is changed
function changeImg(shp) {
  var color = document.getElementById('gram-border');
  var image = document.getElementById('uploaded');
  var msg = document.getElementById('message-box');
  var placement = $("input[name='placement']:checked").val();
  
  if (shp == "rectangle") {
    color.style.clipPath = "none";
    image.style.clipPath = "none";
    msg.style.clipPath = "none";
  } else if (shp == "oval") {
    color.style.clipPath = "circle(300px at 50% 50%)";
    image.style.clipPath = "circle(300px at 50% 50%)";
    
    if (placement == "top") {
      msg.style.clipPath = "circle(300px at 50% 100%)";
    } else if (placement == "bottom") {
      msg.style.clipPath = "circle(300px at 50% 0%)";
    } else if (placement == "left") {
      msg.style.clipPath = "circle(300px at 100% 50%)";
    } else if (placement == "right") {
      msg.style.clipPath = "circle(300px at 0% 50%)";
    } else if (placement == "full") {
      msg.style.clipPath = "circle(300px at 50% 50%)";
    }
  } else if (shp == "heart") {
    color.style.clipPath = "polygon(50% 100%, 0% 25%, 1% 18%, 2% 15%, 3% 13%, 4% 11%, 5% 10%, 6% 9%, 7% 8%, 8% 7%, 9% 6%, 10% 5%, 16% 2%, 21% 0%, 22% 0%, 23% 0%, 24% 0%, 25% 0%, 26% 0%, 27% 0%, 28% 0%, 29% 0%, 35% 2%, 40% 5%, 41% 6%, 42% 7%, 43% 8%, 44% 9%, 45% 10%, 46% 11%, 47% 13%, 48% 15%, 49% 18%, 50% 25%, 51% 18%, 52% 15%, 53% 13%, 54% 11%, 55% 10%, 56% 9%, 57% 8%, 58% 7%, 59% 6%, 60% 5%, 65% 2%, 71% 0%, 72% 0%, 73% 0%, 74% 0%, 75% 0%, 76% 0%, 77% 0%, 78% 0%, 79% 0%, 85% 2%, 90% 5%, 91% 6%, 92% 7%, 93% 8%, 94% 9%, 95% 10%, 96% 11%, 97% 13%, 98% 15%, 99% 18%, 100% 25%)";
    image.style.clipPath = "polygon(50% 100%, 0% 25%, 1% 18%, 2% 15%, 3% 13%, 4% 11%, 5% 10%, 6% 9%, 7% 8%, 8% 7%, 9% 6%, 10% 5%, 16% 2%, 21% 0%, 22% 0%, 23% 0%, 24% 0%, 25% 0%, 26% 0%, 27% 0%, 28% 0%, 29% 0%, 35% 2%, 40% 5%, 41% 6%, 42% 7%, 43% 8%, 44% 9%, 45% 10%, 46% 11%, 47% 13%, 48% 15%, 49% 18%, 50% 25%, 51% 18%, 52% 15%, 53% 13%, 54% 11%, 55% 10%, 56% 9%, 57% 8%, 58% 7%, 59% 6%, 60% 5%, 65% 2%, 71% 0%, 72% 0%, 73% 0%, 74% 0%, 75% 0%, 76% 0%, 77% 0%, 78% 0%, 79% 0%, 85% 2%, 90% 5%, 91% 6%, 92% 7%, 93% 8%, 94% 9%, 95% 10%, 96% 11%, 97% 13%, 98% 15%, 99% 18%, 100% 25%)";
    
    if (placement == "top") {
      msg.style.clipPath = "polygon(16.67% 50%, 0% 25%, 1% 18%, 2% 15%, 3% 13%, 4% 11%, 5% 10%, 6% 9%, 7% 8%, 8% 7%, 9% 6%, 10% 5%, 16% 2%, 21% 0%, 22% 0%, 23% 0%, 24% 0%, 25% 0%, 26% 0%, 27% 0%, 28% 0%, 29% 0%, 35% 2%, 40% 5%, 41% 6%, 42% 7%, 43% 8%, 44% 9%, 45% 10%, 46% 11%, 47% 13%, 48% 15%, 49% 18%, 50% 25%, 51% 18%, 52% 15%, 53% 13%, 54% 11%, 55% 10%, 56% 9%, 57% 8%, 58% 7%, 59% 6%, 60% 5%, 65% 2%, 71% 0%, 72% 0%, 73% 0%, 74% 0%, 75% 0%, 76% 0%, 77% 0%, 78% 0%, 79% 0%, 85% 2%, 90% 5%, 91% 6%, 92% 7%, 93% 8%, 94% 9%, 95% 10%, 96% 11%, 97% 13%, 98% 15%, 99% 18%, 100% 25%, 83.33% 50%)";
    } else if (placement == "bottom") {
      msg.style.clipPath = "polygon(50% 100%, 16.67% 50%, 83.33% 50%)";
    } else if (placement == "left") {
      msg.style.clipPath = "polygon(50% 100%, 0% 25%, 1% 18%, 2% 15%, 3% 13%, 4% 11%, 5% 10%, 6% 9%, 7% 8%, 8% 7%, 9% 6%, 10% 5%, 16% 2%, 21% 0%, 22% 0%, 23% 0%, 24% 0%, 25% 0%, 26% 0%, 27% 0%, 28% 0%, 29% 0%, 35% 2%, 40% 5%, 41% 6%, 42% 7%, 43% 8%, 44% 9%, 45% 10%, 46% 11%, 47% 13%, 48% 15%, 49% 18%, 50% 25%)";
    } else if (placement == "right") {
      msg.style.clipPath = "polygon(50% 100%, 50% 25%, 51% 18%, 52% 15%, 53% 13%, 54% 11%, 55% 10%, 56% 9%, 57% 8%, 58% 7%, 59% 6%, 60% 5%, 65% 2%, 71% 0%, 72% 0%, 73% 0%, 74% 0%, 75% 0%, 76% 0%, 77% 0%, 78% 0%, 79% 0%, 85% 2%, 90% 5%, 91% 6%, 92% 7%, 93% 8%, 94% 9%, 95% 10%, 96% 11%, 97% 13%, 98% 15%, 99% 18%, 100% 25%)";
    } else if (placement == "full") {
      msg.style.clipPath = "polygon(50% 100%, 0% 25%, 1% 18%, 2% 15%, 3% 13%, 4% 11%, 5% 10%, 6% 9%, 7% 8%, 8% 7%, 9% 6%, 10% 5%, 16% 2%, 21% 0%, 22% 0%, 23% 0%, 24% 0%, 25% 0%, 26% 0%, 27% 0%, 28% 0%, 29% 0%, 35% 2%, 40% 5%, 41% 6%, 42% 7%, 43% 8%, 44% 9%, 45% 10%, 46% 11%, 47% 13%, 48% 15%, 49% 18%, 50% 25%, 51% 18%, 52% 15%, 53% 13%, 54% 11%, 55% 10%, 56% 9%, 57% 8%, 58% 7%, 59% 6%, 60% 5%, 65% 2%, 71% 0%, 72% 0%, 73% 0%, 74% 0%, 75% 0%, 76% 0%, 77% 0%, 78% 0%, 79% 0%, 85% 2%, 90% 5%, 91% 6%, 92% 7%, 93% 8%, 94% 9%, 95% 10%, 96% 11%, 97% 13%, 98% 15%, 99% 18%, 100% 25%)";
    }
  }
}

// Function to adjust background of gram when new color is selection
function changeColor(color) {
  var image = document.getElementById('gram-border');
  image.src = "images/" + color + ".png";
}

// Function to move message box based on gram shape and selected location
function moveMessage(pos) {

  var shape_val = $("input[name='shape']:checked").val();  
  var message_box = document.getElementById('message-box');

  if (shape_val == "heart") {
    
    message_box.style.width = "600px";
    message_box.style.height = "600px";
    message_box.style.marginTop = "0px";
    message_box.style.marginLeft = "0px";

    if (pos == "top") {
      message_box.style.clipPath = "polygon(16.67% 50%, 0% 25%, 1% 18%, 2% 15%, 3% 13%, 4% 11%, 5% 10%, 6% 9%, 7% 8%, 8% 7%, 9% 6%, 10% 5%, 16% 2%, 21% 0%, 22% 0%, 23% 0%, 24% 0%, 25% 0%, 26% 0%, 27% 0%, 28% 0%, 29% 0%, 35% 2%, 40% 5%, 41% 6%, 42% 7%, 43% 8%, 44% 9%, 45% 10%, 46% 11%, 47% 13%, 48% 15%, 49% 18%, 50% 25%, 51% 18%, 52% 15%, 53% 13%, 54% 11%, 55% 10%, 56% 9%, 57% 8%, 58% 7%, 59% 6%, 60% 5%, 65% 2%, 71% 0%, 72% 0%, 73% 0%, 74% 0%, 75% 0%, 76% 0%, 77% 0%, 78% 0%, 79% 0%, 85% 2%, 90% 5%, 91% 6%, 92% 7%, 93% 8%, 94% 9%, 95% 10%, 96% 11%, 97% 13%, 98% 15%, 99% 18%, 100% 25%, 83.33% 50%)";
    } else if (pos == "bottom") {
      message_box.style.clipPath = "polygon(50% 100%, 16.67% 50%, 83.33% 50%)";
    } else if (pos == "left") {
      message_box.style.clipPath = "polygon(50% 100%, 0% 25%, 1% 18%, 2% 15%, 3% 13%, 4% 11%, 5% 10%, 6% 9%, 7% 8%, 8% 7%, 9% 6%, 10% 5%, 16% 2%, 21% 0%, 22% 0%, 23% 0%, 24% 0%, 25% 0%, 26% 0%, 27% 0%, 28% 0%, 29% 0%, 35% 2%, 40% 5%, 41% 6%, 42% 7%, 43% 8%, 44% 9%, 45% 10%, 46% 11%, 47% 13%, 48% 15%, 49% 18%, 50% 25%)";
    } else if (pos == "right") {
      message_box.style.clipPath = "polygon(50% 100%, 50% 25%, 51% 18%, 52% 15%, 53% 13%, 54% 11%, 55% 10%, 56% 9%, 57% 8%, 58% 7%, 59% 6%, 60% 5%, 65% 2%, 71% 0%, 72% 0%, 73% 0%, 74% 0%, 75% 0%, 76% 0%, 77% 0%, 78% 0%, 79% 0%, 85% 2%, 90% 5%, 91% 6%, 92% 7%, 93% 8%, 94% 9%, 95% 10%, 96% 11%, 97% 13%, 98% 15%, 99% 18%, 100% 25%)";
    } else if (pos == "full") {
      message_box.style.clipPath = "polygon(50% 100%, 0% 25%, 1% 18%, 2% 15%, 3% 13%, 4% 11%, 5% 10%, 6% 9%, 7% 8%, 8% 7%, 9% 6%, 10% 5%, 16% 2%, 21% 0%, 22% 0%, 23% 0%, 24% 0%, 25% 0%, 26% 0%, 27% 0%, 28% 0%, 29% 0%, 35% 2%, 40% 5%, 41% 6%, 42% 7%, 43% 8%, 44% 9%, 45% 10%, 46% 11%, 47% 13%, 48% 15%, 49% 18%, 50% 25%, 51% 18%, 52% 15%, 53% 13%, 54% 11%, 55% 10%, 56% 9%, 57% 8%, 58% 7%, 59% 6%, 60% 5%, 65% 2%, 71% 0%, 72% 0%, 73% 0%, 74% 0%, 75% 0%, 76% 0%, 77% 0%, 78% 0%, 79% 0%, 85% 2%, 90% 5%, 91% 6%, 92% 7%, 93% 8%, 94% 9%, 95% 10%, 96% 11%, 97% 13%, 98% 15%, 99% 18%, 100% 25%)";
    }
  } else {
    if (pos == "top") {
      message_box.style.width = "600px";
      message_box.style.height = "300px";
      message_box.style.marginTop = "0px";
      message_box.style.marginLeft = "0px";

      if (shape_val == "retangle") {
        message_box.style.clipPath = "none";
      } else if (shape_val == "oval") {
        message_box.style.clipPath = "circle(300px at 50% 100%)";
      }
    } else if (pos == "bottom") {
      message_box.style.width = "600px";
      message_box.style.height = "300px";
      message_box.style.marginTop = "300px";
      message_box.style.marginLeft = "0px";

      if (shape_val == "retangle") {
        message_box.style.clipPath = "none";
      } else if (shape_val == "oval") {
        message_box.style.clipPath = "circle(300px at 50% 0%)";
      }
    } else if (pos == "left") {
      message_box.style.width = "300px";
      message_box.style.height = "600px";
      message_box.style.marginTop = "0px";
      message_box.style.marginLeft = "0px";

      if (shape_val == "retangle") {
        message_box.style.clipPath = "none";
      } else if (shape_val == "oval") {
        message_box.style.clipPath = "circle(300px at 100% 50%)";
      }
    } else if (pos == "right") {
      message_box.style.width = "300px";
      message_box.style.height = "600px";
      message_box.style.marginTop = "0px";
      message_box.style.marginLeft = "300px";

      if (shape_val == "retangle") {
        message_box.style.clipPath = "none";
      } else if (shape_val == "oval") {
        message_box.style.clipPath = "circle(300px at 0% 50%)";
      }
    } else if (pos == "full") {
      message_box.style.width = "600px";
      message_box.style.height = "600px";
      message_box.style.marginTop = "0px";
      message_box.style.marginLeft = "0px";

      if (shape_val == "retangle") {
        message_box.style.clipPath = "none";
      } else if (shape_val == "oval") {
        message_box.style.clipPath = "circle(300px at 50% 50%)";
      }
    }
  }
}

// Function to upload image and display it on client side
function loadFile(event) {
  
  var image = document.getElementById('uploaded');
  var img = new Image();
  image.src = URL.createObjectURL(event.target.files[0]);
  img.src = URL.createObjectURL(event.target.files[0]);

  img.onload = function() {
    var width = img.naturalWidth,
        height = img.naturalHeight;
    
    if (width > height) {
      image.style.width = "600px";
      image.style.height = (600 * height / width) + 'px';
      image.style.marginTop = (300 * (1 - height / width)) + 'px';
      image.style.marginLeft = "0px";
    } else {
      image.style.width = (600 * width / height) + 'px';
      image.style.height = "600px";
      image.style.marginTop = "0px";
      image.style.marginLeft = (300 * (1 - width / height)) + 'px';
    }
  }
}

// When the window is fully loaded, call this function.
$(window).load(function () {

  // Find the HTML element with the id gram-form, and when the submit event is triggered on that element, call submitForm.
  $("#gram-form").submit(submitForm);

  // Initiate the autocomplete function on the "camp" element, and pass along the camps array as possible autocomplete values
  autocomplete(document.getElementById("camp"), camps);
});
