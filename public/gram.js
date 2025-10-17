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
  var contact_org = $("#contact-org").val();
  var contact_website = "";
  var contact_message = "";
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

        // If user chose org, put donation link on page
        if (orgs.includes(selections["org"])) {
          if (org_dict[selections["org"]][0] != "") {
            var donation = document.getElementById('donation');
            donation.innerHTML = "<a href='" + org_dict[selections["org"]][0] + "' target='_blank'>" + selections["your_name"] + " sent you this Shabbat-o-Gram in honor of " + selections["org"] + ". Click here if you'd like to make a donation.</a>";

            // Show logo
            if (org_dict[selections["org"]][1] != "") {
              $("#logo-container").show();
              $("#logo-link").attr("href", org_dict[selections["org"]][0]);
              $("#logo").attr("src", "images/logos/" + org_dict[selections["org"]][1]);
            }
          }
        } else if (selections["org"] != "") {
          var donation = document.getElementById('donation');
          donation.innerHTML = selections["your_name"] + " sent you this Shabbat-o-Gram in honor of " + selections["org"] + ". Please consider visiting their website to make a donation in this difficult time.";
        }
      }
    });
  });
}
