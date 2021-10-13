// const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const functions = require("firebase-functions");

// admin.initializeApp();

const API_KEY =
  "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";

sgMail.setApiKey(API_KEY);

exports.newFunction = functions.https.onRequest((req, res) => {
  res.send("Hello from Firebase function");
});

exports.genericMail = functions.https.onCall(
  async (noteContent, attendees, context, title) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "User must be logged in"
      );
    }

    const message = {
      to: attendees,
      from: "foyer.work@gmail.com",
      subject: `Foyer Notes : ${title}`,
      // text: "Testing",
      html: noteContent,
    };
    await sgMail.send(message);
    return { success: true };
  }
);
