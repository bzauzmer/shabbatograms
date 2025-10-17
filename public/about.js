// Initialize Firebase app
firebase.initializeApp(config);

// Reference to the shabbatograms object in Firebase database
var contacts = firebase.database().ref("contacts");

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
