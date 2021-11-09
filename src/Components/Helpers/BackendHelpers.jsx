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
    body: "",
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
  const {
    db,
    setLoading,
    setActionItems,
    noteId,
    userId,
    assigneeID,
    completed,
  } = props;
  await setLoading(true);

  var docRef = db.collection("ActionItems").orderBy("date", "asc");

  if (noteId) docRef = docRef.where("noteId", "==", noteId);
  else if (assigneeID)
    docRef = docRef.where("assignees", "array-contains", assigneeID);
  else if (userId) docRef = docRef.where("creator", "==", userId);

  docRef = docRef.where("status", "==", completed);

  const actionItems = [];
  // await docRef.onSnapshot(async (querySnapshot) => {
  //   await querySnapshot.docChanges().forEach(async (change) => {
  //     await actionItems.push({ id: change.doc.id, data: change.doc.data() });
  //   });
  //   await setActionItems(actionItems);
  // });

  await docRef.get().then(async (querySnapshot) => {
    await querySnapshot.forEach(async (doc) => {
      console.log(doc.data(), doc.id);
      actionItems.push({ id: doc.id, data: doc.data() });
    });
    await setActionItems(actionItems);
  });
  setTimeout(() => setLoading(false), 300);
  // await setLoading(false);
};

export { addMeetNote, getActionItems };
