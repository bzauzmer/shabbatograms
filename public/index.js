'use strict';

// Reference to the shabbatograms objects in Firebase database
var grams = firebase.database().ref("shabbatograms");
var secure = firebase.database().ref("shabbatograms-secure");
var contacts = firebase.database().ref("contacts");
var storageRef = firebase.storage().ref();
var consoleLog = firebase.functions().httpsCallable('consoleLog');

// Global variable to store canvas
var lc, canvas_left, canvas_top, canvas_width, canvas_height, image_loaded;

// Global variable for canvas shape
var canvas_shape = 'vertical';

// Global variable for recipient type
var recipient_type = 'person';

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

function ValidateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return (true)
  }
  alert("You have entered an invalid email address.")
  return (false)
}

function ValidatePhone(num) {
   if (/^\d{10}$/.test(num)) {
    return (true)
  }
  alert("You have entered an invalid phone number.")
  return (false) 
}

// Save a new submission to the database, using the input in the form
var submitForm = function () {

  // Remove borders from previous validation
  $(".my-drawing").css({"border-width":"0px"});
  $("#your-name-input").css({"border-width":"0px"});
  $("#your-email-input").css({"border-width":"0px"});
  $("#recipient-name-input > div").css({"border-width":"0px"});
  $("#recipient-email-input > div").css({"border-width":"0px"});
  $("#recipient-phone-input > div").css({"border-width":"0px"});
  $("#org-input").css({"border-width":"0px"});

  // Validate form
  var form_ready = true;
  var your_name = $("#your-name").val();
  var your_email = $("#your-email").val();
  var recipient_name = $("#recipient-name").val();
  var delivery_method = $("input[name='delivery-method']:checked").val();
  var recipient_email = $("#recipient-email").val();
  var recipient_phone = $("#recipient-phone").val();
  var org = $("#org").val();

  if ($(".lc-undo").hasClass("disabled")) {
    $(".my-drawing").css({"border-color": "red", "border-width":"1px", "border-style":"solid"});
    alert("Please draw a Shabbat-o-Gram in the canvas before submitting.")
    form_ready = false;
  }

  if (your_name == "") {
    $("#your-name-input").css({"border-color": "red", "border-width":"1px", "border-style":"solid"});
    alert("Please enter your name before submitting.")
    form_ready = false;
  }

  if (!ValidateEmail(your_email)) {
    $("#your-email-input").css({"border-color": "red", "border-width":"1px", "border-style":"solid"});
    form_ready = false;
  }

  if (recipient_type == "person") {

    if (recipient_name == "") {
      $("#recipient-name-input > div").css({"border-color": "red", "border-width":"1px", "border-style":"solid"});
      alert("Please enter a recipient name before submitting.")
      form_ready = false;
    }

    if (delivery_method == "email") {

      if (!recipient_email.split(",").every(el => ValidateEmail(el.trim()))) {
        $("#recipient-email-input > div").css({"border-color": "red", "border-width":"1px", "border-style":"solid"});
        form_ready = false;
      }
    } else if (delivery_method == "text") {

      if (!recipient_phone.split(",").every(el => ValidatePhone(el.trim()))) {
        $("#recipient-phone-input > div").css({"border-color": "red", "border-width":"1px", "border-style":"solid"});
        form_ready = false;
      }
    }
  } else if (recipient_type == "org") {

    if (org == "") {
      $("#org-input").css({"border-color": "red", "border-width":"1px", "border-style":"solid"});
      alert("Please select a community from the dropdown.")
      form_ready = false;
    }
  }

  // Check if form is ready to be sent
  if (form_ready) {

    // Commit text element to canvas
    lc.setTool(new LC.tools.Pencil(lc));

    // Get input values from each of the form elements
    var id = Math.random().toFixed(10).substring(2,12);
    var your_instagram = $("#your-instagram").val();

    // Get weekday and hour in LA
    var day_of_week = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})).getDay();
    var hour_of_day = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})).getHours();
    var minute_of_hour = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})).getMinutes();    

    // Binary variable indicating whether Friday deliveries still need to be sent
    if (recipient_type == "org") {
      var ready = 1;
      var sent = 0;
    } else if (recipient_type == "person") {
      
      // Create buffer zone between deadline and sending
      if (day_of_week == 5 & hour_of_day == 13 & minute_of_hour < 15) {
        var ready = 0;
      } else {
        var ready = 1;
      }
      var sent = 0;
    }

    // Push a new form to the database using those values
    grams.push().set({
      id: id,
      recipient_type: recipient_type,
      your_name: your_name,
      recipient_name: recipient_name,
      delivery_method: delivery_method,
      ready: ready,
      sent: sent,
      org: org
    });

    secure.push().set({
      id: id,
      your_email: your_email,
      recipient_email: recipient_email,
      recipient_phone: recipient_phone,
      your_instagram: your_instagram
    });

    // Push image to Firebase
    var uploadTask = storageRef.child('images/' + id).put(dataURItoBlob(
      lc.getImage({rect: {x:0, y:0, width:canvas_width, height:canvas_height}}).toDataURL()));

    // Monitor upload task
    uploadTask.on('state_changed', function(snapshot) {
      return null;
    }, function(error) {
      consoleLog('Error: ' + error + ' ' + id);
    }, function() {
      consoleLog('Success: ' + id);
    });

    // Hide everything before post-submit
    $("#intro").hide();
    $("#gram-form").hide();
    
    // Show post-submit box
    var post_submit = document.getElementById('post-submit');
    post_submit.style.display = "block";
    
    // Show message based on recipient type
    $('#confirm-' + recipient_type).show();

    // Next Friday if deadline has passed
    if (day_of_week == 5 & hour_of_day >= 13) {
      $(".next").show();
      $(".on").hide();
    }

    // Check if org has donation URL
    if (orgs.includes(org)) {
      if (org_dict[org][0] != "") {

        // Show donation paragraph
        var donation = document.getElementById('donation');
        donation.style.display = "inline";
      
        // Input org name
        var org_name = document.getElementById('org-name');
        org_name.innerHTML = org;
        
        // Input org donation link
        var org_link = document.getElementById('org-link');
        org_link.href = org_dict[org][0];
      }
    }
  }
};

// Save a new contact submission to the database, using the input in the form
var contactForm = function () {

  // Get input values from each of the form elements
  var contact_name = $("#contact-name").val();
  var contact_email = $("#contact-email").val();
  var contact_org = $("#contact-org").val();
  var contact_website = $("#contact-website").val();
  var contact_message = $("#contact-message").val();
  var contact_spam = $("#contact-spam").val();

  // Detect spam
  if (contact_spam.toLowerCase() == "friday") {

    // Push a new form to the database using those values
    contacts.push().set({
      contact_name: contact_name,
      contact_email: contact_email,
      contact_org: contact_org,
      contact_website: contact_website,
      contact_message: contact_message
    });

    // Show post-submit message
    $("#success-message").show();
  } else {

    // Show post-submit message
    $("#failure-message").show();
  }

  // Hide contact form
  $("#contact-form").hide();
};

function deliveryMethod(method) {

  if (method == "email") {
    $("#recipient-email-input").show();
    $("#recipient-phone-input").hide();
  } else if (method == "text") {
    $("#recipient-phone-input").show();
    $("#recipient-email-input").hide();
  }
}

function increasing(elt, idx, ar) { 
  var prev = ar[idx - 1];
  return !idx || elt === prev + 1;
}

function increasing(e, i, a) {
  if (e >= 0) {
    if (i) {
      return e > a[i-1];
    } else {
      return true;
    }
  } else {
    return false;
  }
}

// Handle autocomplete functionality for org input
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
      var words = val.toLowerCase().split(" ").map(function(w) {return w.toLowerCase(); }).filter(Boolean);
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item contains all words in the text field value:*/
        if (words.map(function(w) { return arr[i].toLowerCase().indexOf(w); }).every(increasing)) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          var prev_index = 0;
          /*make the matching letters bold:*/
          b.innerHTML = "";
          for (var w = 0; w < words.length; w++) {
            b.innerHTML += arr[i].substr(prev_index, arr[i].toLowerCase().indexOf(words[w].toLowerCase()) - prev_index);
            b.innerHTML += "<strong>" + arr[i].substr(arr[i].toLowerCase().indexOf(words[w].toLowerCase()), words[w].length) + "</strong>";
            prev_index = arr[i].toLowerCase().indexOf(words[w].toLowerCase()) + words[w].length;
          }
          b.innerHTML += arr[i].substr(prev_index);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += '<input type="hidden" value="' + arr[i] + '">';
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
              showLogo(inp.value);
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

// Display organization logo
function showLogo(current_org) {

  // Clear current logo
  $("#logo-container").hide();
  
  // Check if org is valid
  if (orgs.includes(current_org)) {

    // Check if org has logo
    if (org_dict[current_org][1] != "") {

      // Add link and logo to page
      $("#logo-container").show();
      $("#logo-link").attr("href", org_dict[current_org][0]);
      $("#logo").attr("src", "images/logos/" + org_dict[current_org][1]);
    }
  }

  // Change text of org confirmation
  $("#org-follow").text(current_org);
}

// Function to toggle whether person or org page is shown
function toggleOrg(type) {
  
  if (type == 'person') {

    // Change recipient type for storage
    recipient_type = 'person';

    // Show person inputs
    $("#person-intro").show();
    $("#person-toggle").show();
    $("#person-timing").show();
    $(".shape").show();
    $("#recipient-name-input").show();
    $("#delivery-method-input").show();
    $("#recipient-contact-input").show();
    $("#delivery-time-input").show();

    // Hide org text
    $("#org-intro").hide();
    $("#org-toggle").hide();
    $("#org-timing").hide();
    $("#your-instagram-input").hide();
    $("#org-required").hide();

    changeImg(canvas_shape);

    // Show all tools on mobile
    if ($('#gram-form').width() < 500) {
      $("[title=Polygon]").show();
      $("[title=Pan]").show();
      $("[title=Eyedropper]").show();
      $(".lc-zoom-out").show();
      $(".lc-zoom-in").show();
      $(".lc-clear").show();
    }

  } else if (type == 'org') {

    // Change recipient type for storage
    recipient_type = 'org';

    // Hide person inputs
    $("#person-intro").hide();
    $("#person-toggle").hide();
    $("#person-timing").hide();
    $(".shape").attr('style','display:none !important');
    $("#recipient-name-input").hide();
    $("#delivery-method-input").hide();
    $("#recipient-contact-input").hide();
    $("#delivery-time-input").hide();

    // Show org text
    $("#org-intro").show();
    $("#org-toggle").show();
    $("#org-timing").show();
    $("#your-instagram-input").show();
    $("#org-required").show();

    changeImg('org');

    // Hide tools to avoid overlapping
    if ($('#gram-form').width() < 500) {
      $("[title=Polygon]").hide();
      $("[title=Pan]").hide();
      $("[title=Eyedropper]").hide();
      $(".lc-zoom-out").hide();
      $(".lc-zoom-in").hide();
      $(".lc-clear").hide();
    }
  }
}

// Function to adjust gram display when shape is changed
function changeImg(shp) {

  var gram_form_w = $('#gram-form').width();

  // For Instagram posts, shape should be square
  if (shp == "org") {

    // Set shape as percentage of form width
    if ($('#gram-form').width() < 500) {
      $(".my-drawing").width(gram_form_w);
      $(".my-drawing").height(gram_form_w - 30);
    } else {
      $(".my-drawing").width(0.64 * gram_form_w);
      $(".my-drawing").height(0.64 * gram_form_w - 30);
    }
  } else {

    // Store canvas shape in case of recipient type change
    canvas_shape = shp;

    // Set shape as percentage of form width
    if ($('#gram-form').width() < 500) {
      
      $(".my-drawing").width(gram_form_w);
      $(".my-drawing").height(1.4 * gram_form_w);

    } else if (shp == 'vertical') {
      
      $(".my-drawing").width(0.6 * gram_form_w);
      $(".my-drawing").height(0.66 * gram_form_w);

    } else if (shp == 'horizontal') {

      $(".my-drawing").width(0.73 * gram_form_w);
      $(".my-drawing").height(0.55 * gram_form_w);
    }
  }

  // Change canvas shape
  $(".literally").css('min-height', $(".my-drawing").height());
  lc.setImageSize($(".my-drawing").width(), $(".my-drawing").height());
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
    {imageURLPrefix: '/static/img',
    imageSize: {width: $(window).width(), height: 700},
    strokeWidths: [1, 2, 5, 10, 20],
    backgroundColor: "#ffffff"}
  );

  changeImg('vertical');
  lc.respondToSizeChange();

  // Get canvas dimensions
  canvasDims()

  // Find the HTML element with the id gram-form, and when the submit event is triggered on that element, call submitForm.
  $("#gram-form").submit(submitForm);

  // Initiate the autocomplete function on the "org" element, and pass along the orgs array as possible autocomplete values
  autocomplete(document.getElementById("org"), orgs);

  // Display font names in their font
  $(".lc-pick-tool[title^='Text']").on("click", function() {
    setTimeout(function() {
      $(".lc-font-settings select:nth-child(2) option").each(function(ix) {
        $(this).css("font-family", $(this).attr("value"));
      });
    }, 1000);
  });

  // Toggle modal for for contacts vs adding an organization
  $("#contact-button").on("click", function() {
    $(".add-org").hide();
    $("#contact-form").show();
    $("#success-message").hide();
    $("#failure-message").hide();
  });

  $("#add-org-button").on("click", function() {
    $(".add-org").show();
    $("#contact-form").show();
    $("#success-message").hide();
    $("#failure-message").hide();
  });
});

// Listen for click outside of canvas
$(":not(.my-drawing):not(.my-drawing *)").mousedown(function(e) {

  // Check if there is currently a resizable image
  if ($(".resize-container")[0]) {
    
    // Create copy of image and save it to canvas in current location
    var newImage = new Image();
    newImage.src = $(".resize-image").attr("src");
    lc.saveShape(LC.createShape('Image', {
      x: $(".resize-container").offset().left - canvas_left,
      y: $(".resize-container").offset().top - canvas_top,
      image: newImage
    }));

    // Delete resizable image
    $(".resize-container").remove();
  }
});

//Show name of uploaded image
$(".custom-file-input").on("change", function() {
  var fileName = $(this).val().split("\\").pop();
  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});
