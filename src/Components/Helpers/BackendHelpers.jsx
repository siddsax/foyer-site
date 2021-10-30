import uuid from "react-uuid";

const addMeetNote = async (props) => {
  const { meet, db, history, user } = props;
  const uid = uuid();

  const attendeesEmails = [];

  for (let i = 0; i < meet.attendees.length; i++) {
    attendeesEmails.push(meet.attendees[i].email);
  }

  const newNote = {
    id: uid,
    title: meet.title,
    body: '[{"type":"paragraph","children":[{"text":""}]}]',
    lastModified: Date.now(),
    createdAt:
      typeof meet.createdAt === "undefined" ? Date.now() : meet.createdAt,
    hangoutLink:
      typeof meet.hangoutLink === "undefined" ? null : meet.hangoutLink,
    meetId: meet.id,
    attendees: meet.attendees,
    end: meet.end,
    creator: user.uid,
    access: attendeesEmails,
  };
  await db.collection("Notes").doc(`${uid}`).set(newNote);
  history.push(`/note-${uid}`);

  return newNote;
};

const getActionItems = async (props) => {
  const { db, setLoading, setActionItems, noteId, userId, assigneeID } = props;
  await setLoading(true);

  var docRef = db.collection("ActionItems").orderBy("date", "asc");
  if (noteId) {
    docRef = docRef.where("assignees", "array-contains", noteId);
  } else if (assigneeID) {
    docRef = docRef.where("noteId", "==", assigneeID);
  } else if (userId) {
    docRef = docRef.where("creator", "==", userId);
  }

  await docRef.onSnapshot((querySnapshot) => {
    querySnapshot.docChanges().forEach((change) => {
      console.log(change.doc.id, " => ", change.doc.data());
      setActionItems((preVal) => [
        ...preVal,
        { id: change.doc.id, data: change.doc.data() },
      ]);
    });
  });

  await setLoading(false);
};

export { addMeetNote, getActionItems };
