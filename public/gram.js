// Initialize Firebase app
firebase.initializeApp(config);

// Reference to the shabbatograms object in Firebase database
var grams = firebase.database().ref("shabbatograms");

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

  grams.once('value').then(function(snapshot) {
    var params = getParams(window.location.href);
    var id = params["id"];
    var data = snapshot.val();

    Object.keys(data).forEach(function(key) {
      if (data[key]["id"] == id) {
        var selections = data[key];

        if (selections["camp"] != "") {
          var donation = document.getElementById('donation');
          donation.innerHTML = "<a href='" + camp_dict[selections["camp"]] + "' target='_blank'>" + selections["your-name"] + " sent you this Shabbat-o-gram in honor of " + selections["camp"] + ". Click here if you'd like to make a donation.</a>";
        }
      }
    });
  });
}
