import { useEffect, useState, useCallback, useRef } from "react";
import uuid from "react-uuid";
import ActiveNote from "../../Components/activeNote/ActiveNote";
import Sidebar from "../../Components/sidebar/Sidebar";
import Header from "../../Components/header/header";
import firebase from "../../firebase";
// import debounce from "../../helpers";
import { debounce } from "debounce";

const NotesPage = (props) => {
  const { user } = props;
  const db = firebase.firestore();
  // const [notes, setNotes] = useState(
  //   localStorage.notes ? JSON.parse(localStorage.notes) : []
  // );
  const [notes, setNotes] = useState([]);
  const [activeNoteID, setActiveNoteID] = useState(false);
  const [activeNote, setActiveNote] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  var lastVisible = useRef(0);
  // useEffect(() => {
  //   localStorage.setItem("notes", JSON.stringify(notes));
  // }, [notes]);

  const onAddNote = () => {
    const uid = uuid();
    const newNote = {
      id: uid,
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
      createdAt: Date.now(),
    };
    db.collection("Users")
      .doc(`${user.uid}`)
      .collection("Notes")
      .doc(`${uid}`)
      .set(newNote);

    setNotes([newNote, ...notes]);
    setActiveNoteID(newNote.id);
  };

  const onDeleteNote = (noteId) => {
    setNotes(notes.filter(({ id }) => id !== noteId));
    db.collection("Users")
      .doc(`${user.uid}`)
      .collection("Notes")
      .doc(`${noteId}`)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };

  const onUpdateNoteDB = (updatedNote) => {
    db.collection("Users")
      .doc(`${user.uid}`)
      .collection("Notes")
      .doc(`${updatedNote.id}`)
      .update({
        title: updatedNote.title,
        body: updatedNote.body,
        lastModified: updatedNote.lastModified,
      });
  };

  const debouncedOnUpdateNoteDB = useCallback(
    debounce(onUpdateNoteDB, 1500),
    []
  );

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note) => {
      if (note.id === updatedNote.id) {
        setActiveNote(updatedNote);
        return updatedNote;
      }
      return note;
    });

    setNotes(updatedNotesArr);
  };

  const getActiveNote = async () => {
    var activeNote = null;
    if (activeNoteID) {
      var docRef = db
        .collection("Users")
        .doc(`${user.uid}`)
        .collection("Notes")
        .doc(`${activeNoteID}`);

      docRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document exists", doc.data());
            activeNote = doc.data();
          } else {
            console.log("No such document!");
            activeNote = null;
          }
          setActiveNote(activeNote);
        })
        .catch((error) => {
          console.log("Error getting document:", error);
          setActiveNote(null);
        });
    }
  };

  const fillNotes = (querySnapshot) => {
    querySnapshot.forEach(async (doc) => {
      await setNotes((oldArray) => [...oldArray, doc.data()]);
    });
    lastVisible.current = querySnapshot.docs[querySnapshot.docs.length - 1];
  };

  const fetchNotes = () => {
    // **** here's the timeout ****
    const paginateNumber = 6;
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 300);

    const ref = db
      .collection("Users")
      .doc(`${user.uid}`)
      .collection("Notes")
      .orderBy("createdAt", "desc");

    if (lastVisible.current == 0) {
      ref.limit(paginateNumber).get().then(fillNotes);
    } else if (lastVisible.current != null) {
      ref
        .startAfter(lastVisible.current)
        .limit(paginateNumber)
        .get()
        .then(fillNotes);
    } else {
      console.log("At the end of things");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    getActiveNote();
  }, [activeNoteID]);

  return (
    <>
      <Header />
      <div className="App">
        <Sidebar
          notes={notes}
          onAddNote={onAddNote}
          onDeleteNote={onDeleteNote}
          activeNote={activeNoteID}
          setActiveNote={setActiveNoteID}
          fetchNotes={fetchNotes}
          isButtonDisabled={isButtonDisabled}
        />
        <ActiveNote
          activeNote={activeNote}
          onUpdateNote={onUpdateNote}
          onUpdateNoteDB={debouncedOnUpdateNoteDB}
        />
      </div>
    </>
  );
};

export default NotesPage;
