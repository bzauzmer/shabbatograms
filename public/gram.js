// Initialize Firebase app
firebase.initializeApp(config);

// Reference to the shabbatograms object in Firebase database
var grams = firebase.database().ref("shabbatograms");
var contacts = firebase.database().ref("contacts");
var storageRef = firebase.storage().ref();

// Save a new contact submission to the database, using the input in the form
var contactForm = function () {

  // Get input values from each of the form elements
  var contact_name = $("#contact-name").val();
  var contact_email = $("#contact-email").val();
  var contact_message = $("#contact-message").val();

  // Push a new form to the database using those values
  contacts.push().set({
    contact_name: contact_name,
    contact_email: contact_email,
    contact_message: contact_message
  });

  // Show post-submit message
  $("#contact-form").hide();
  $("#success-message").show();
};

// Function to add page elements on load based on ID
function load() {

  // Request grams data from Firebase
  grams.once('value').then(function(snapshot) {
    var params = getParams(window.location.href);
    var id = params["id"];
    var data = snapshot.val();

    // Loop through keys to find id for this page
    Object.keys(data).forEach(function(key) {
      if (data[key]["id"] == id) {
        var selections = data[key];

        if (selections["show_camp"] == 0) {
          $("#return-link").attr("href", "index.html?camp=0");
          $("#header-link").attr("href", "index.html?camp=0");
          $("#header-image").attr("src", "images/header-nocamp.png");
        }

        // Pull image from Firebase
        storageRef.child('images/' + id).getDownloadURL().then(function(url) {

          // Put URL into image
          $('#image').attr('src', url);

          // Wait for image to load
          $("#image").bind('load', function() {

            // Get image dimensions
            var width = $('#image').width();
            var height = $('#image').height();

            // Keep image dimensions ratio
            if ($('#message').width() < 500) {
              $('#image').width("100%");
            } else if (width > height) {
              $('#image').width("80%");
            } else {
              $('#image').width("60%");
            }

            $('#image').height($('#image').width() * height / width);
          });
        });

        // If user chose camp, put donation link on page
        if (camps.includes(selections["camp"]) & camp_dict[selections["camp"]] != "") {
          var donation = document.getElementById('donation');
          donation.innerHTML = "<a href='" + camp_dict[selections["camp"]] + "' target='_blank'>" + selections["your_name"] + " sent you this Shabbat-o-Gram in honor of " + selections["camp"] + ". Click here if you'd like to make a donation.</a>";
        } else if (selections["camp"] != "") {
          var donation = document.getElementById('donation');
          donation.innerHTML = selections["your_name"] + " sent you this Shabbat-o-Gram in honor of " + selections["camp"] + ". Please consider visiting their website to make a donation in this difficult time.";
        }
      }
    });
  });
}
