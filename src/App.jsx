import { useEffect, useState } from "react";
import uuid from "react-uuid";
import "./App.css";
import Main from "./Components/main/Main";
import Sidebar from "./Components/sidebar/Sidebar";
import SignIn from "./Components/signin";
import Header from "./Components/header";
import { useAuthState } from "react-firebase-hooks/auth";
import "./firebase";
import firebase from "firebase";
function App() {
  var loading_db = false;
  const [user, loading_auth, error] = useAuthState(firebase.auth());
  const [notes, setNotes] = useState(
    localStorage.notes ? JSON.parse(localStorage.notes) : []
  );
  const [activeNote, setActiveNote] = useState(false);
  const [tmp, stmp] = useState(null);
  const [schools, setSchools] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    console.log(tmp);
  }, [tmp]);

  console.log(user);

  useEffect(async () => {
    if (user) {
      console.log("++++++++++++++", `Users/${user.uid}`);
      loading_db = true;
      firebase
        .database()
        .ref("Users/" + user.uid)
        .set({
          email: user.email,
          photoURL: user.photoURL,
          Name: user.displayName,
        });

      // get(child(dbRef, `Users/${user.uid}`))
      //   .then((snapshot) => {
      //     if (snapshot.exists()) {
      //       console.log("!!!!!!!!!!!!!!!!!", snapshot.val());
      //     } else {
      //       console.log("No data exist, adding user");
      //       set(ref(db, "Users/" + user.uid), {
      //         accessToken: user.accessToken,
      //         email: user.email,
      //         photoURL: user.photoURL,
      //         Name: user.displayName,
      //       });
      //     }
      //   })
      //   .catch((error) => {
      //     console.error(error);
      //   });
      console.log("**************");
      loading_db = false;
    }
    if (loading_auth) {
      loading_db = true;
    }
  }, [user]);

  const onAddNote = () => {
    const newNote = {
      id: uuid(),
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
    };

    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
  };

  const onDeleteNote = (noteId) => {
    setNotes(notes.filter(({ id }) => id !== noteId));
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

  const renderPage = () => {
    return user ? (
      <div>
        <Header stmp={stmp} />
        <div className="App">
          <Sidebar
            notes={notes}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
            activeNote={activeNote}
            setActiveNote={setActiveNote}
          />
          <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
        </div>
      </div>
    ) : (
      <SignIn />
    );
  };

  // console.log(user.email);

  return (
    <>
      {loading_auth || loading_db ? (
        <div>
          <h1>Loading</h1>
        </div>
      ) : (
        renderPage()
      )}
    </>
  );
}

export default App;
