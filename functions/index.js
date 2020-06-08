// Load Firebase and mailing functions
'use strict';
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

admin.initializeApp();

// Read texting credentials from config file
const accountSid = functions.config().twilio.sid
const authToken  = functions.config().twilio.token
const twilioNumber = '+16506463674'
const client = new twilio(accountSid, authToken);

// Read email credentials from config file
const emailHost = functions.config().email.host;
const emailAddress = functions.config().email.address;
const emailPassword = functions.config().email.password;

// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}

// Function to send email
var goMail = function (cd) {

  // Transporter defines email account
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: 587,
    secure: false,
    auth: {
      user: emailAddress,
      pass: emailPassword
    },
    tls: {rejectUnauthorized: false}
  });

  // Set up email data
  const mailOptions = {
      from: "Shabbat-o-Grams <" + emailAddress + ">",
      to: cd["recipient_email"].split(",").map(el => el.trim()),
      bcc: ["bzauzmer@gmail.com","shaynagolkow@gmail.com"], 
      subject: 'You\'ve received a Shabbat-o-Gram!',
      text: "Dear " + cd["recipient_name"] + ",\r\n\r\n" + cd["your_name"] +
        " has sent you a Shabbat-o-Gram! Copy and paste the following link to view it: https://shabbatograms.web.app/gram.html?id=" + cd["id"] +
        "\r\n\r\nShabbat shalom,\r\nThe Shabbat-o-Gram Team\r\n",
      html: 'Dear ' + cd["recipient_name"] + ',<br><br>' + cd["your_name"] +
        ' has sent you a Shabbat-o-Gram! <a href=\"https://shabbatograms.web.app/gram.html?id=' + cd["id"] + '\">Click here</a> to view it.' + 
        '<br><br>Shabbat shalom,<br>The Shabbat-o-Gram Team<br>'
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

// Function to send email
var goContact = function (cd) {

  // Transporter defines email account
  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: 587,
    secure: false,
    auth: {
      user: emailAddress,
      pass: emailPassword
    },
    tls: {rejectUnauthorized: false}
  });

  // Set up email data
  const mailOptions = {
      from: "Shabbat-o-Grams <" + emailAddress + ">",
      to: ["bzauzmer@gmail.com","shaynagolkow@gmail.com"],
      subject: 'Shabbat-o-Grams Contact Submission',
      text: 'You have a new Shabbat-o-Grams contact submission from ' + cd["contact_name"] + ' (' +
        cd["contact_email"] + '):\r\n\r\n' + cd["contact_message"] + '\r\n',
      html: 'You have a new Shabbat-o-Grams contact submission from ' + cd["contact_name"] + ' (<a href=\"mailto:' +
        cd["contact_email"] + '\">' + cd["contact_email"] + '</a>):<br><br>' + cd["contact_message"] + '<br>'
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

var goText = function(cd) {

  // Loop through phone numbers
  cd["recipient_phone"].split(",").map(el => el.trim()).forEach(function(phone) {

    // Confirm phone number is valid
    if (!validE164(phone)) {
      throw new Error('number must be E164 format!');
    }

    // Build text message
    const textMessage = {
      from: twilioNumber,
      to: phone,
      body: `Hi ${cd["recipient_name"]} -- ${cd["your_name"]} has sent you a Shabbat-o-Gram! Click here to view it: https://shabbatograms.web.app/gram.html?id=${cd["id"]}`
    };

    // Send text message
    client.messages.create(textMessage);
  });  
};

// Watch for change in database
exports.onDataAdded = functions.database.ref("/shabbatograms/{sessionId}").onCreate(function (snap, context) {

    // Get new data added to database
    const createdData = snap.val();

    // Check if user wants to send email now
    if (createdData["delivery_time"] == "now") {

      if (createdData["delivery_method"] == "email") {

        // Run function to send mail based on newly added data
        goMail(createdData);

      } else if (createdData["delivery_method"] == "text") {

        // Run function to send text based on newly added data
        goText(createdData)
      }
    }
});

// Watch for change in contact database
exports.onContactAdded = functions.database.ref("/contacts/{sessionId}").onCreate(function (snap, context) {

    // Get new data added to database
    const createdData = snap.val();

    // Run function to send mail based on newly added data
    goContact(createdData);
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

              if (data[key]["delivery_method"] == "email") {

                // Send email
                goMail(data[key]);

              } else if (data[key]["delivery_method"] == "text") {

                // Send text
                goText(data[key]);
              }

              // Update sent field in entry
              var updates = {sent: 1};

              // Push update to Firebase
              admin.database().ref("/shabbatograms/" + key).update(updates);
            }
        });
    });
});
