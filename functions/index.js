// Load Firebase and mailing functions
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Read Gmail credentials from config file
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

// Function to send email
var goMail = function (cd) {

  // Transporter defines email account
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: gmailEmail,
          pass: gmailPassword
      }
  });

  // Set up email data
  const mailOptions = {
      from: "Shabbat-o-grams <" + gmailEmail + ">",
      to: cd["recipient_email"],
      subject: 'You\'ve received a Shabbat-o-gram!',
      text: "Dear " + cd["recipient_name"] + ",\r\n\r\n" + cd["your_name"] +
        " has sent you a Shabbat-o-gram! Copy and paste the following link to view it: https://shabbatograms.web.app/gram.html?id=" + cd["id"] +
        "\r\n\r\nShabbat shalom,\r\nThe Shabbat-o-gram Team\r\n",
      html: 'Dear ' + cd["recipient_name"] + ',<br><br>' + cd["your_name"] +
        ' has sent you a Shabbat-o-gram! <a href=\"https://shabbatograms.web.app/gram.html?id=' + cd["id"] + '\">Click here</a> to view it.' + 
        '<br><br>Shabbat shalom,<br>The Shabbat-o-gram Team<br>'
  };

  // Error handling function
  const getDeliveryStatus = function (error, info) {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
  };

  // Call function to send mail and return delivery status
  transporter.sendMail(mailOptions, getDeliveryStatus);
};

// Watch for change in database
exports.onDataAdded = functions.database.ref("/shabbatograms/{sessionId}").onCreate(function (snap, context) {

    // Get new data added to database
    const createdData = snap.val();

    // Run function to send mail based on newly added data
    goMail(createdData);
});

// Scheduled function for pre-Shabbat deliveries
exports.scheduledFunction = functions.pubsub.schedule('0 13 * * 5').timeZone('America/Los_Angeles').onRun((context) => {
    
    // Pull data from Firebase
    admin.database().ref("shabbatograms").on("value", function(snapshot) {

        // Store data
        var data = snapshot.val();

        // Loop through keys
        Object.keys(data).forEach(function(key) {

            // Find unsent entries 
            if (data[key]["sent"] == 0) {

                // Send email
                goMail(data[key]);

                // Update sent field in entry
                var updates = {sent: 1};

                // Push update to Firebase
                admin.database().ref("/shabbatograms/" + key).update(updates);
            }
        });
    });
});
