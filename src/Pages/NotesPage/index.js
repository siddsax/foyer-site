import { useEffect, useState } from "react";
import uuid from "react-uuid";
import ActiveNote from "../../Components/activeNote/ActiveNote";
import Sidebar from "../../Components/sidebar/Sidebar";
import Header from "../../Components/header";
import firebase from "../../firebase";

const NotesPage = (props) => {
  const { user } = props;
  const db = firebase.firestore();
  // const [notes, setNotes] = useState(
  //   localStorage.notes ? JSON.parse(localStorage.notes) : []
  // );
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(false);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    db.collection("Users")
      .doc(`${user.uid}`)
      .collection("Notes")
      .get()
      .then((querySnapshot) => {
        console.log("&");
        querySnapshot.forEach(async (doc) => {
          await setNotes([...notes, doc.data()]);
        });
      });
  }, []);

  const onAddNote = () => {
    const uid = uuid();
    const newNote = {
      id: uid,
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
    };
    db.collection("Users")
      .doc(`${user.uid}`)
      .collection("Notes")
      .doc(`${uid}`)
      .set(newNote);

    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
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

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note) => {
      if (note.id === updatedNote.id) {
        return updatedNote;
      }

      return note;
    });

    setNotes(updatedNotesArr);
  };

  const getActiveNote = () => {
    return notes.find(({ id }) => id === activeNote);
  };

  return (
    <>
      <Header />
      <div className="App">
        <Sidebar
          notes={notes}
          onAddNote={onAddNote}
          onDeleteNote={onDeleteNote}
          activeNote={activeNote}
          setActiveNote={setActiveNote}
        />
        <ActiveNote activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
      </div>
    </>
  );
};

export default NotesPage;
