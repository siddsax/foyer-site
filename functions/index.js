require("firebase-functions/lib/logger/compat");

// const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const API_KEY =
  "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";

sgMail.setApiKey(API_KEY);

exports.genericMail = functions.https.onCall(async (props) => {
  const { noteContent, attendees, title } = props;
  console.log(attendees, title, noteContent, "++++++++++++++++++++");

  const message = {
    to: attendees,
    from: "foyer.work@gmail.com",
    subject: `Foyer Notes : ${title}`,
    text: "Testing",
    html: noteContent,
    send_at: Date.now(),
  };

  await sgMail.send(message);
  return { success: true };
});

exports.sendMailActionItem = functions.firestore
  .document("ActionItems/{actionItemID}")
  .onCreate((snapshot, context) => {
    // Grab the current value of what was written to the Realtime Database.
    const original = snapshot.data();
    const message = {
      to: original.creatorEmail.concat(original.assignees),
      from: "foyer.work@gmail.com",
      subject: `Foyer Action Items : ${original.title}`,
      text: "Testing Action Items " + original.title,
      // html: noteContent,
    };

    functions.logger.log("Hello from info. Here's an object:", original);
    console.log(original);

    sgMail.send(message);
    return { success: true };
  });

exports.sendMailActionItemReminder = functions.pubsub
  .schedule("every 5 minutes")
  // .schedule("every 15 minutes")
  .timeZone("America/New_York")
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now().seconds;
    const nowUnix = new Date(now * 1000).getTime();
    const nowMin15 = new Date(nowUnix - 15 * 60 * 1000);

    console.log(
      nowMin15,
      now,
      nowUnix,
      new Date(now * 1000),
      "+++++++++++++++++++"
    );
    console.log(
      admin.firestore.Timestamp.fromMillis(nowMin15),
      admin.firestore.Timestamp.now(),
      "-------------------"
    );
    const query = db
      .collection("ActionItems")
      .where("date", ">=", admin.firestore.Timestamp.fromMillis(nowMin15))
      .where("date", "<=", admin.firestore.Timestamp.now())
      .where("status", "==", false)
      .where("reminder", "==", false);

    const reminders = await query.get();

    let emailRecievers = [
      ...new Set(reminderData.assignees.concat(reminderData.creatorEmail)),
    ];

    reminders.forEach((snapshot) => {
      const reminderData = snapshot.data();
      const message = {
        to: emailRecievers,
        from: "foyer.work@gmail.com",
        subject: `Foyer Action Items : ${reminderData.title}`,
        text: "This is a reminder for the task: " + reminderData.title,
        // html: noteContent,
      };

      console.log(
        message,
        reminderData.assignees.concat(reminderData.creatorEmail),
        reminderData,
        "++~~~~~~~~~~~~~~~~~~~~~@@@@@@@@@@@@++"
      );
      sgMail
        .send(message)
        .then((response) => {
          console.log(response[0].statusCode, response[0].headers, "________");
        })
        .catch((error) => {
          console.error(error, "$$$$$$$$$$$$");
        });

      db.collection("ActionItems").doc(snapshot.id).update({
        reminder: true,
      });
    });
    console.log("Done doing everything here");
    return null;
  });
