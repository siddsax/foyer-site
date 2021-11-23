import uuid from "react-uuid";
import moment from "moment";

const addMeetNote = async (props) => {
  const { meet, db, history, user } = props;
  const uid = uuid();

  const attendeesEmails = [];

  for (let i = 0; i < meet.attendees.length; i++) {
    attendeesEmails.push(meet.attendees[i].email);
  }

  const newNote = {
    id: uid,
    title:
      meet.title === "undefined"
        ? meet.title
        : `Adhock meeting on ${moment().format("MMM Do YY, h:mm a")}`,
    body: "",
    lastModified: Date.now(),
    createdAt:
      typeof meet.createdAt === "undefined" ? Date.now() : meet.createdAt,
    hangoutLink:
      typeof meet.hangoutLink === "undefined" ? null : meet.hangoutLink,
    meetId: meet.id ? meet.id : null,
    attendees: meet.attendees,
    end: meet.end ? meet.end : null,
    creator: user.uid,
    access: attendeesEmails,
  };

  console.log(newNote, "~~~~~~~~~~~~~~~~~");
  await db.collection("Notes").doc(`${uid}`).set(newNote);
  history.push(`/note-${uid}`);

  return newNote;
};

const getActionItems = async (props) => {
  const {
    db,
    setLoading,
    setActionItems,
    noteId,
    userId,
    assigneeID,
    completed,
    realtime,
  } = props;
  await setLoading(true);

  var docRef = db.collection("ActionItems").orderBy("date", "asc");

  if (noteId) docRef = docRef.where("noteId", "==", noteId);
  else if (assigneeID)
    docRef = docRef.where("assignees", "array-contains", assigneeID);
  else if (userId) docRef = docRef.where("creator", "==", userId);

  if (typeof completed != "undefined") {
    docRef = docRef.where("status", "==", completed);
  }

  const fillItems = async (props) => {
    const actionItems = [];
    const { querySnapshot } = props;
    await querySnapshot.forEach(async (doc) => {
      actionItems.push({ id: doc.id, data: doc.data() });
    });
    await setActionItems(actionItems);
  };

  if (realtime) {
    await docRef.onSnapshot(async (querySnapshot) => {
      await setLoading(true);
      await fillItems({ querySnapshot: querySnapshot });
      setTimeout(() => setLoading(false), 300);
    });
  } else {
    await docRef.get().then(async (querySnapshot) => {
      await fillItems({ querySnapshot: querySnapshot });
      setTimeout(() => setLoading(false), 300);
    });
  }
};

export { addMeetNote, getActionItems };
