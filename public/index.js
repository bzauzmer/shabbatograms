'use strict';

// Initialize Firebase app
firebase.initializeApp(config);

// Reference to the shabbatograms objects in Firebase database
var grams = firebase.database().ref("shabbatograms");
var storageRef = firebase.storage().ref();

// Global variable to store uploaded image
var blob;

// Save a new submission to the database, using the input in the form
var submitForm = function () {

  // Get input values from each of the form elements
  var id = Math.random().toFixed(10).substring(2,12);
  var shape = $("input[name='shape']:checked").val();
  var image = $("#uploaded");
  var music = $("#music").val();
  var your_name = $("#your-name").val();
  var your_email = $("#your-email").val();
  var recipient_name = $("#recipient-name").val();
  var recipient_email = $("#recipient-email").val();
  var delivery_time = $("input[name='delivery-time']:checked").val();
  var camp = $("#camp").val();

  // Binary variable indicating whether Friday deliveries still need to be sent
  if (delivery_time == "now") {
    var sent = 1;
  } else {
    var sent = 0;
  }

  // Push a new form to the database using those values
  grams.push().set({
    id: id,
    shape: shape,
    music: music,
    your_name: your_name,
    your_email: your_email,
    recipient_name: recipient_name,
    recipient_email: recipient_email,
    delivery_time: delivery_time,
    sent: sent,
    camp: camp
  });

  // Push image to Firebase
  if (blob !== undefined) {
    storageRef.child('images/' + id).put(blob);
  }

  // Hide form  
  var form = document.getElementById('gram-form');
  form.style.display = "none";
  
  // Show post-submit box
  var post_submit = document.getElementById('post-submit');
  post_submit.style.display = "block";
  
  // Show message based on whether user wanted delivery time now or later
  var confirm = document.getElementById('confirm-' + delivery_time);
  confirm.style.display = "inline";
  
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
  return true;
}

// Function to upload image and display it on client side
function loadFile(event) {
  
  // Define image variables
  var image = document.getElementById('uploaded');
  var img = new Image();

  // Upload image and display on site
  blob = event.target.files[0];
  image.src = URL.createObjectURL(blob);
  img.src = URL.createObjectURL(blob);

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

  // Initiate Literally Canvas
  LC.init(
    document.getElementsByClassName('my-drawing')[0],
    {imageURLPrefix: '/static/img'}
  );

  // Find the HTML element with the id gram-form, and when the submit event is triggered on that element, call submitForm.
  $("#gram-form").submit(submitForm);

  // Initiate the autocomplete function on the "camp" element, and pass along the camps array as possible autocomplete values
  autocomplete(document.getElementById("camp"), camps);
});
