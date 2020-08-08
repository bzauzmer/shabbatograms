// Reference to the shabbatograms object in Firebase database
var grams = firebase.database().ref("shabbatograms");
var storageRef = firebase.storage().ref();
var queuePassword = firebase.functions().httpsCallable('queuePassword');
var queuePwd;

// Retrieve queue password
queuePassword().then(function(v) {
  queuePwd = v["data"];
});

// When the window is fully loaded, call this function
$(window).load(function () {

  // Enable enter key to submit form
  $("#password").on('keypress', function (e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      $("#form-submit").click();
    }
  });
});

// Function to add page elements on load
function submitPassword() {

  // Check queue password
  if ($("#password").val() == queuePwd) {

    // Hide password form
    $("#password-form").hide();

    // Request grams data from Firebase
    grams.once('value').then(function(snapshot) {
      var data = snapshot.val();

      // Loop through keys to find id for this page
      Object.keys(data).forEach(function(key) {
        var selections = data[key];

        // Find grams that are ready to be sent but haven't been yet
        if (selections["ready"] == 1 & selections["sent"] == 0) {

          // Get org with link to donation page
          if (orgs.includes(selections["org"]) & org_dict[selections["org"]][0] != "") {
            var org_link = "<a href='" + org_dict[selections["org"]][0] + "' target='_blank'>" + selections["org"] + "</a>";
          } else if (selections["org"] != "") {
            var org_link = selections["org"];
          }

          // Append new image container
          $("body").append(
            "<div class='image-container container col-xs-12 col-sm-12 col-md-8 col-lg-8 p-0'>" +
              "<p><b>ID:</b> <a href='https://www.shabbat-o-grams.com/gram.html?id=" + selections["id"] + "' target='_blank'>" + selections["id"] + "</a></p>" +
              "<p><b>Sender:</b> " + selections["your_name"] + "</p>" +
              "<p><b>Recipient:</b> " + selections["recipient_name"] + "</p>" +
              "<p><b>Type:</b> " + selections["recipient_type"].charAt(0).toUpperCase() + selections["recipient_type"].slice(1) + "</p>" +
              "<p><b>Organization:</b> " + org_link + "</p><br>" +
              "<img id='image-" + selections["id"] + "'>" +
            "</div><br>");

          // Pull image from Firebase
          storageRef.child('images/' + selections["id"]).getDownloadURL().then(function(url) {

            // Put URL into image
            $('#image-' + selections["id"]).attr('src', url);

            // Wait for image to load
            $('#image-' + selections["id"]).bind('load', function() {

              // Get image dimensions
              var width = $('#image-' + selections["id"]).width();
              var height = $('#image-' + selections["id"]).height();

              // Keep image dimensions ratio
              if ($('body').width() < 700) {
                $('#image-' + selections["id"]).width("100%");
              } else if (width > height) {
                $('#image-' + selections["id"]).width("80%");
              } else {
                $('#image-' + selections["id"]).width("60%");
              }

              $('#image-' + selections["id"]).height($('#image-' + selections["id"]).width() * height / width);
            });
          });
        }
      });
    });
  }
}
