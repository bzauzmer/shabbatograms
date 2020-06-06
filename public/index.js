'use strict';

// Initialize Firebase app
firebase.initializeApp(config);

// Reference to the shabbatograms objects in Firebase database
var grams = firebase.database().ref("shabbatograms");
var storageRef = firebase.storage().ref();

// Global variable to store canvas
var lc, canvas_left, canvas_top, canvas_width, canvas_height, image_loaded;

// Convert data URI to blob
function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}

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
  storageRef.child('images/' + id).put(dataURItoBlob(lc.getImage().toDataURL()));

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
        if (arr[i].toLowerCase().includes(val.toLowerCase())) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = arr[i].substr(0, arr[i].toLowerCase().indexOf(val.toLowerCase()));
          b.innerHTML += "<strong>" + arr[i].substr(arr[i].toLowerCase().indexOf(val.toLowerCase()), val.length) + "</strong>";
          b.innerHTML += arr[i].substr(arr[i].toLowerCase().indexOf(val.toLowerCase()) + val.length);
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

  if (shp == 'vertical') {
    $(".my-drawing").width(500);
    $(".my-drawing").height(600);
    $(".literally").css('min-height', 600);
    lc.setImageSize(500, 600);
  } else if (shp == 'horizontal') {
    $(".my-drawing").width(650);
    $(".my-drawing").height(450);
    $(".literally").css('min-height', 450);
    lc.setImageSize(650, 450);
  }

  lc.respondToSizeChange();

  // Get canvas dimensions
  canvasDims()  
}

// Function to upload image and display it on client side
function loadFile(event) {

  // Initialize image with class
  var img = new Image();
  img.setAttribute('class', 'resize-image');
  
  // New image is loaded
  image_loaded = false;

  // Run once image has loaded
  img.onload = function() {

    // Check if image has already been loaded
    if (!image_loaded) {

      // Add uploaded image to div containing canvas    
      $(".my-drawing").append(img);

      // Enable resizing and moving
      resizeableImage($('.resize-image'), this.width, this.height);

      // Don't load image again
      image_loaded = true;
    }
  }

  // Image source is user file
  img.src = URL.createObjectURL(event.target.files[0]);

  // Show the word another above file input
  $("#another").show();
}

//Function to get canvas dimensions
function canvasDims() {

  canvas_left = $(".lc-drawing").offset().left
  canvas_top = $(".lc-drawing").offset().top
  canvas_width = $(".lc-drawing").width()
  canvas_height = $(".lc-drawing").height()
}

// When the window is fully loaded, call this function.
$(window).load(function () {

  // Initiate Literally Canvas
  lc = LC.init(
    document.getElementsByClassName('my-drawing')[0],
    {imageURLPrefix: '/static/img', imageSize: {width: 500, height: 700}}
  );

  lc.respondToSizeChange();

  // Get canvas dimensions
  canvasDims()

  // Find the HTML element with the id gram-form, and when the submit event is triggered on that element, call submitForm.
  $("#gram-form").submit(submitForm);

  // Initiate the autocomplete function on the "camp" element, and pass along the camps array as possible autocomplete values
  autocomplete(document.getElementById("camp"), camps);
});
