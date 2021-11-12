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

const getActionItemSendMail = async (props) => {
  const { dateField, content, mailStatusField } = props;
  const now = admin.firestore.Timestamp.now().seconds;
  const nowUnix = new Date(now * 1000).getTime();
  const nowMin15 = new Date(nowUnix - 15 * 60 * 1000);

  const query = db
    .collection("ActionItems")
    .where(dateField, ">=", admin.firestore.Timestamp.fromMillis(nowMin15))
    .where(dateField, "<=", admin.firestore.Timestamp.now())
    .where("status", "==", false)
    .where(mailStatusField, "==", false);

  const reminders = await query.get();

  reminders.forEach((snapshot) => {
    const reminderData = snapshot.data();
    let emailRecievers = [
      ...new Set(reminderData.assignees.concat(reminderData.creatorEmail)),
    ];

    const message = {
      to: emailRecievers,
      from: "foyer.work@gmail.com",
      subject: `Foyer Action Items : ${reminderData.title}`,
      text: content + reminderData.title,
      // html: noteContent,
    };

    sgMail
      .send(message)
      .then((response) => {
        console.log(response[0].statusCode, response[0].headers, "________");
      })
      .catch((error) => {
        console.error(error, "$$$$$$$$$$$$");
      });

    if (mailStatusField == "reminderMail") {
      db.collection("ActionItems").doc(snapshot.id).update({
        reminderMail: true,
      });
    } else if (mailStatusField == "finalMail") {
      db.collection("ActionItems").doc(snapshot.id).update({
        finalMail: true,
      });
    }
  });
  console.log("Done doing everything here");
};

exports.sendMailActionItemReminder = functions.pubsub
  .schedule("every 14 minutes")
  .timeZone("America/New_York")
  .onRun(async (context) => {
    getActionItemSendMail({
      dateField: "dateReminder",
      mailStatusField: "reminderMail",
      content: "This is a reminder for the task: ",
    });
    return null;
  });

exports.sendMailActionItemFinish = functions.pubsub
  .schedule("every 14 minutes")
  .timeZone("America/New_York")
  .onRun(async (context) => {
    getActionItemSendMail({
      dateField: "date",
      mailStatusField: "finalMail",
      content: "What is the status of the task: ",
    });
    return null;
  });
