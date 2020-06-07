// Initialize Firebase app
firebase.initializeApp(config);

// Reference to the shabbatograms object in Firebase database
var grams = firebase.database().ref("shabbatograms");
var contacts = firebase.database().ref("contacts");
var storageRef = firebase.storage().ref();

// Function to extract parameters from URL
function getParams(url) {
  var params = {};
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
};

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
            if (width > height || $('#message').width() < 500) {
              $('#image').width("100%");
              $('#image').height($('#image').width() * height / width);
            } else {
              $('#image').width("60%");
              $('#image').height($('#image').width() * height / width);
            }
          });
        });

        // If user chose camp, put donation link on page
        if (selections["camp"] != "") {
          var donation = document.getElementById('donation');
          donation.innerHTML = "<a href='" + camp_dict[selections["camp"]] + "' target='_blank'>" + selections["your_name"] + " sent you this Shabbat-o-gram in honor of " + selections["camp"] + ". Click here if you'd like to make a donation.</a>";
        }
      }
    });
  });
}
