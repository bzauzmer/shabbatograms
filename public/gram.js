// Initialize Firebase app
firebase.initializeApp(config);

// Reference to the shabbatograms object in Firebase database
var grams = firebase.database().ref("shabbatograms");
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
          var image = document.getElementById('image');
          image.src = url;
        });

        // Put message on page
        var message = document.getElementById('message');
        message.innerHTML = selections["message_box"];

        // If user chose camp, put donation link on page
        if (selections["camp"] != "") {
          var donation = document.getElementById('donation');
          donation.innerHTML = "<a href='" + camp_dict[selections["camp"]] + "' target='_blank'>" + selections["your_name"] + " sent you this Shabbat-o-gram in honor of " + selections["camp"] + ". Click here if you'd like to make a donation.</a>";
        }
      }
    });
  });
}
