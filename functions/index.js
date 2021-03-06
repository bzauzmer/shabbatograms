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

// Read queue credentials from config file
const queuePwd = functions.config().queue.password;

// Transporter defines email account
const transporter = nodemailer.createTransport({
  pool: true,
  host: emailHost,
  port: 587,
  secure: false,
  auth: {
    user: emailAddress,
    pass: emailPassword
  },
  tls: {rejectUnauthorized: false}
});

// Validate E164 format
function validE164(num) {
    return /^\+?[1-9]\d{1,14}$/.test(num)
}

// Function to send email
var goNotify = function (cd) {

  // Set up email data
  const mailOptions = {
      from: "Shabbat-o-Grams <" + emailAddress + ">",
      to: ["bzauzmer@gmail.com","shaynagolkow@gmail.com"],
      subject: 'Someone has sent a Shabbat-o-Gram!',
      text: 'Gram<br>' +
        'URL: https://www.shabbat-o-grams.com/gram.html?id=' + cd["id"] + '\r\n' +
        'Recipient Type: ' + cd["recipient_type"] + '\r\n' +
        'Delivery Method: ' + cd["delivery_method"] + '\r\n' +
        'Community: ' + cd["org"] + '\r\n\r\n' +
        'Sender\r\n' +
        'Name: ' + cd["your_name"] + '\r\n' +
        'Email: ' + cd["your_email"] + '\r\n' +
        'Instagram: ' + cd["your_instagram"] + '\r\n\r\n' +
        'Recipient\r\n' +
        'Name: ' + cd["recipient_name"] + '\r\n' +
        'Email: ' + cd["recipient_email"] + '\r\n' +
        'Phone Number: ' + cd["recipient_phone"] + '\r\n',
      html: '<u>Gram</u><br>' +
        '<b>URL:</b> <a href=\"https://www.shabbat-o-grams.com/gram.html?id=' + cd["id"] + '\">https://www.shabbat-o-grams.com/gram.html?id=' + cd["id"] +'</a><br>' +
        '<b>Recipient Type:</b> ' + cd["recipient_type"] + '<br>' +
        '<b>Delivery Method:</b> ' + cd["delivery_method"] + '<br>' +
        '<b>Community:</b> ' + cd["org"] + '<br><br>' +
        '<u>Sender</u><br>' +
        '<b>Name:</b> ' + cd["your_name"] + '<br>' +
        '<b>Email:</b> ' + cd["your_email"] + '<br>' +
        '<b>Instagram:</b> ' + cd["your_instagram"] + '<br><br>' +
        '<u>Recipient</u><br>' +
        '<b>Name:</b> ' + cd["recipient_name"] + '<br>' +
        '<b>Email:</b> ' + cd["recipient_email"] + '<br>' +
        '<b>Phone Number:</b> ' + cd["recipient_phone"] + '<br>'
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
var goMail = function (cd) {

  // Set up email data
  const mailOptions = {
      from: "Shabbat-o-Grams <" + emailAddress + ">",
      to: cd["recipient_email"].split(",").map(el => el.trim()),
      bcc: ["bzauzmer@gmail.com","shaynagolkow@gmail.com"],
      subject: 'You\'ve received a Shabbat-o-Gram!',
      text: "Hi " + cd["recipient_name"] + ",\r\n\r\n" + cd["your_name"] +
        " has sent you a Shabbat-o-Gram! Copy and paste the following link to view it: https://www.shabbat-o-grams.com/gram.html?id=" + cd["id"] +
        "\r\n\r\nShabbat shalom,\r\nThe Shabbat-o-Grams Team\r\n",
      html: 'Hi ' + cd["recipient_name"] + ',<br><br>' + cd["your_name"] +
        ' has sent you a Shabbat-o-Gram! <a href=\"https://www.shabbat-o-grams.com/gram.html?id=' + cd["id"] + '\">Click here</a> to view it.' + 
        '<br><br>Shabbat shalom,<br>The Shabbat-o-Grams Team<br>'
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

  // Set up email data
  const mailOptions = {
      from: "Shabbat-o-Grams <" + emailAddress + ">",
      to: ["bzauzmer@gmail.com","shaynagolkow@gmail.com"],
      subject: 'Shabbat-o-Grams Contact Submission',
      text: 'You have a new Shabbat-o-Grams contact submission from ' + cd["contact_name"] + ' (' +
        cd["contact_email"] + '):\r\n\r\n' +
        'Community: ' + cd["contact_org"] + '\r\n' +
        'Website: ' + cd["contact_website"] + '\r\n' +
        'Message: ' + cd["contact_message"] + '\r\n',
      html: 'You have a new Shabbat-o-Grams contact submission from ' + cd["contact_name"] + ' (<a href=\"mailto:' +
        cd["contact_email"] + '\">' + cd["contact_email"] + '</a>):<br><br>' +
        '<b>Community:</b> ' + cd["contact_org"] + '<br>' +
        '<b>Website:</b> <a href=\"' + cd["contact_website"] + '\">' + cd["contact_website"] + '</a><br>' +
        '<b>Message:</b> ' + cd["contact_message"] + '<br>'
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
  cd["recipient_phone"].split(",").map(el => el.trim()).forEach(function(phone, i) {

    setTimeout(() => {
      // Confirm phone number is valid
      if (!validE164(phone)) {
        console.log(phone + ' is invalid');
      } else {

        // Build text message
        const textMessage = {
          from: twilioNumber,
          to: phone,
          body: `Hi ${cd["recipient_name"]} -- ${cd["your_name"]} has sent you a Shabbat-o-Gram! Click here to view it: http://www.shabbat-o-grams.com/gram.html?id=${cd["id"]}`
        };

        // Send text message
        client.messages.create(textMessage);
      }
    }, i * 5000);
  });  
};

var goStats = function(d, ts) {

  // Initialize recipient counts
  var recipients_all = 0;
  var recipients_week = 0;
  var org_counts_all = {};
  var org_counts_week = {};

  // Loop through grams
  Object.keys(d).forEach(function(key) {

    // One recipient per org
    if (d[key]["recipient_type"] == "org") {
      recipients_all += 1;
      if (ts.includes(key)) {
        recipients_week += 1;
      }
    // Count recipients from emails
    } else if (d[key]["delivery_method"] == "email") {
      recipients_all += d[key]["recipient_email"].split(",").length;
      if (ts.includes(key)) {
        recipients_week += d[key]["recipient_email"].split(",").length;
      }
    // Count recipients from texts
    } else if (d[key]["delivery_method"] == "text") {
      recipients_all += d[key]["recipient_phone"].split(",").length;
      if (ts.includes(key)) {
        recipients_week += d[key]["recipient_phone"].split(",").length;
      }
    }

    // Check if user included org
    if (d[key]["org"] != "") {

      // Initialize or increment org counts
      if (org_counts_all.hasOwnProperty(d[key]["org"])) {
        org_counts_all[d[key]["org"]] += 1;
      } else {
        org_counts_all[d[key]["org"]] = 1;
      }

      // Only include orgs that are sending this week
      if (ts.includes(key)) {
        if (org_counts_week.hasOwnProperty(d[key]["org"])) {
          org_counts_week[d[key]["org"]] += 1;
        } else {
          org_counts_week[d[key]["org"]] = 1;
        }
      }
    }
  });

  // Convert org dicts to arrays
  var sorted_orgs_all = [];
  for (var org in org_counts_all) {
    sorted_orgs_all.push([org, org_counts_all[org]]);
  }

  var sorted_orgs_week = [];
  for (var org in org_counts_week) {
    sorted_orgs_week.push([org, org_counts_week[org]]);
  }

  // Sort orgs arrays
  sorted_orgs_all.sort(function(a, b) {
    return b[1] - a[1];
  });

  sorted_orgs_week.sort(function(a, b) {
    return b[1] - a[1];
  });

  // Set up email data
  const mailOptions = {
    from: "Shabbat-o-Grams <" + emailAddress + ">",
    to: ["bzauzmer@gmail.com","shaynagolkow@gmail.com"],
    subject: 'Weekly Shabbat-o-Gram Stats',
    text: 'All-Time\r\n' +
      'Recipients: ' + recipients_all + '\r\n' +
      'Senders: ' + Object.keys(d).length + '\r\n' +
      'Email: ' + Object.keys(d).filter(key => d[key]["recipient_type"] == "person" && d[key]["delivery_method"] == "email").length + '\r\n' +
      'Text: ' + Object.keys(d).filter(key => d[key]["recipient_type"] == "person" && d[key]["delivery_method"] == "text").length + '\r\n' +
      'Instagram: ' + Object.keys(d).filter(key => d[key]["recipient_type"] == "org").length + '\r\n\r\n' +
      sorted_orgs_all.slice(0, 10).map(c => c[0] + ': ' + c[1]).join('\r\n') + '\r\n\r\n' +
      'This Week\r\n' +
      'Recipients: ' + recipients_week + '\r\n' +
      'Senders: ' + ts.length + '\r\n' +
      'Email: ' + ts.filter(key => d[key]["recipient_type"] == "person" && d[key]["delivery_method"] == "email").length + '\r\n' +
      'Text: ' + ts.filter(key => d[key]["recipient_type"] == "person" && d[key]["delivery_method"] == "text").length + '\r\n' +
      'Instagram: ' + ts.filter(key => d[key]["recipient_type"] == "org").length + '\r\n\r\n' +
      sorted_orgs_week.map(c => c[0] + ': ' + c[1]).join('\r\n') + '\r\n',
    html: '<u>All-Time</u><br>' +
      '<b>Recipients:</b> ' + recipients_all + '<br>' +
      '<b>Senders:</b> ' + Object.keys(d).length + '<br>' +
      '<b>Email:</b> ' + Object.keys(d).filter(key => d[key]["recipient_type"] == "person" && d[key]["delivery_method"] == "email").length + '<br>' +
      '<b>Text:</b> ' + Object.keys(d).filter(key => d[key]["recipient_type"] == "person" && d[key]["delivery_method"] == "text").length + '<br>' +
      '<b>Instagram:</b> ' + Object.keys(d).filter(key => d[key]["recipient_type"] == "org").length + '<br><br>' +
      sorted_orgs_all.slice(0, 10).map(c => '<b>' + c[0] + ':</b> ' + c[1]).join('<br>') + '<br><br>' +
      '<u>This Week</u><br>' +
      '<b>Recipients:</b> ' + recipients_week + '<br>' +
      '<b>Senders:</b> ' + ts.length + '<br>' +
      '<b>Email:</b> ' + ts.filter(key => d[key]["recipient_type"] == "person" && d[key]["delivery_method"] == "email").length + '<br>' +
      '<b>Text:</b> ' + ts.filter(key => d[key]["recipient_type"] == "person" && d[key]["delivery_method"] == "text").length + '<br>' +
      '<b>Instagram:</b> ' + ts.filter(key => d[key]["recipient_type"] == "org").length + '<br><br>' +
      sorted_orgs_week.map(c => '<b>' + c[0] + ':</b> ' + c[1]).join('<br>') + '<br>'
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
}

// Watch for change in database
exports.onDataAdded = functions.database.ref("/shabbatograms/{sessionId}").onCreate(function (snap, context) {

  // Get new data added to database
  const data = snap.val();
  var id = data["id"];

  // Pull secure data from Firebase
  admin.database().ref("shabbatograms-secure").once('value').then(function(snapshot_secure) {

    // Store data
    var data_secure = snapshot_secure.val();

    // Merge secure and readable data
    Object.keys(data_secure).map(key_secure => {
      if (id == data_secure[key_secure]["id"]) {
        data["your_email"] = data_secure[key_secure]["your_email"];
        data["recipient_email"] = data_secure[key_secure]["recipient_email"];
        data["recipient_phone"] = data_secure[key_secure]["recipient_phone"];
        data["your_instagram"] = data_secure[key_secure]["your_instagram"];
      }
    });

    // Run function to send mail based on newly added data
    goNotify(data);
  });
});

// Watch for change in contact database
exports.onContactAdded = functions.database.ref("/contacts/{sessionId}").onCreate(function (snap, context) {

  // Get new data added to database
  const createdData = snap.val();

  // Run function to send mail based on newly added data
  goContact(createdData);
});

// Scheduled function for pre-Shabbat deliveries
exports.scheduledFunction = functions.pubsub.schedule('15 13 * * 5').timeZone('America/Los_Angeles').onRun((context) => {
  
  // Pull data from Firebase
  admin.database().ref("shabbatograms").once('value').then(function(snapshot) {

    // Store data
    var data = snapshot.val();

    // Pull secure data from Firebase
    admin.database().ref("shabbatograms-secure").once('value').then(function(snapshot_secure) {

      // Store data
      var data_secure = snapshot_secure.val();

      Object.keys(data).map(key => {
        Object.keys(data_secure).map(key_secure => {
          if (data[key]["id"] == data_secure[key_secure]["id"]) {
            data[key]["your_email"] = data_secure[key_secure]["your_email"];
            data[key]["recipient_email"] = data_secure[key_secure]["recipient_email"];
            data[key]["recipient_phone"] = data_secure[key_secure]["recipient_phone"];
            data[key]["your_instagram"] = data_secure[key_secure]["your_instagram"];
          }
        });
      });

      // New grams to send out
      var to_send = Object.keys(data).filter(key => data[key]["sent"] == 0);

      // Send out stats for the week
      goStats(data, to_send);

      // Loop through keys
      to_send.forEach((key, i) => {

        setTimeout(() => {
          if (data[key]["ready"] == 0) {

            // Update ready field in entry
            var updates = {ready: 1};

            // Push update to Firebase
            admin.database().ref("/shabbatograms/" + key).update(updates);
          } else {

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
        }, i * 5000);
      });
    });
  });
});

// Log to Firebase Console
exports.consoleLog = functions.https.onCall((data, context) => {
  console.log(data);
});

// Return queue password
exports.queuePassword = functions.https.onCall((data, context) => {
  return(queuePwd);
});
