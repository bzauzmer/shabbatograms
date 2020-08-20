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

  // Push a new form to the database using those values
  contacts.push().set({
    contact_name: contact_name,
    contact_email: contact_email,
    contact_org: contact_org,
    contact_website: contact_website,
    contact_message: contact_message
  });

  // Show post-submit message
  $("#contact-form").hide();
  $("#success-message").show();
};

// Reference to the shabbatograms object in Firebase database
var grams = firebase.database().ref("shabbatograms");

// When the window is fully loaded, call this function
$(window).load(function() {

  grams.once('value').then(function(snapshot) {

    // Store data
    var d = snapshot.val();

    // Initialize recipient counts
    var org_counts_all = {};

    // Loop through grams
    Object.keys(d).forEach(function(key) {

      // Check if user included org
      if (d[key]["org"] != "") {

        // Initialize or increment org counts
        if (org_counts_all.hasOwnProperty(d[key]["org"])) {
          org_counts_all[d[key]["org"]] += 1;
        } else {
          org_counts_all[d[key]["org"]] = 1;
        }
      }
    });

    // Convert org dicts to arrays
    var sorted_orgs_all = [];
    for (var org in org_counts_all) {
      sorted_orgs_all.push([org, org_counts_all[org]]);
    }

    // Sort orgs arrays
    sorted_orgs_all.sort(function(a, b) {
      return b[1] - a[1];
    });

    //Initialize trackers for ties
    var prev_rank = 0;
    var prev_grams = 0;

    // Loop through the camps in descending order of grams sent
    sorted_orgs_all.forEach(function(org, ix) {

      // Only list orgs with at least 10 gram
      if (org[1] >= 10) {

        // Handle ties
        if (org[1] == prev_grams) {
          var rank = prev_rank;
        } else {
          var rank = ix + 1;
        }

        // Append row to table
        $("#standings tbody").append(
          "<tr>" +
            "<th scope = 'row' class='align-middle align-center'>" + rank + "</th>" +
            "<td class='align-middle'><img src='images/logos/" + org_dict[org[0]][1] + "' width='80' /></td>" +
            "<td class='align-middle'>" + org[0] + "</td>" +
            "<td class='align-middle align-center'>" + org[1] + "</td>" +
          "</tr>"
        );

        // Update trackers for ties
        prev_rank = rank;
        prev_grams = org[1];
      }
    });
  });
});
