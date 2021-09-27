import Header from "../../Components/header/header";
import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { color, display, flexbox } from "@mui/system";
import "./NotePage.css";
import firebase from "../../firebase";
import dateFormat from "dateformat";
import EditorFoyer from "../../Components/Editor/Editor";
import { EditText } from "react-edit-text";
import { debounce } from "debounce";

const NotePage = (props) => {
  const { user } = props;
  const location = useLocation();
  const activeNoteID = location.pathname.split("note-")[1];
  const [activeNote, setActiveNote] = useState(null);

  const db = firebase.firestore();

  const onUpdateNoteDB = (title, content) => {
    db.collection("Users")
      .doc(`${user.uid}`)
      .collection("Notes")
      .doc(`${activeNoteID}`)
      .update({
        title: title,
        body: content,
        lastModified: Date.now(),
      });
  };

  const debouncedOnUpdateNoteDB = useCallback(
    debounce(onUpdateNoteDB, 1500),
    []
  );

  const getActiveNote = async () => {
    var activeNote = null;

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
  };

  useEffect(() => {
    getActiveNote();
  }, []);

  const updateTitle = (value) => {
    console.log(value);
    onUpdateNoteDB(value, activeNote.body);
  };

  return (
    <div>
      <Header />
      {activeNote ? (
        <div className="notePage">
          <div className="noteArea">
            <div className="noteHeaderArea">
              <EditText
                className="noteTitle"
                style={{
                  padding: "0px",
                  margin: "0px",
                  width: "50%",
                  "background-color": "#282828",
                  outline: "none",
                  "border-width": "0px",
                  height: "40px",
                }}
                onSave={(input) => {
                  updateTitle(input.value);
                }}
                defaultValue={activeNote.title}
              />

              <text className="date">
                {dateFormat(
                  new Date(activeNote.createdAt),
                  "ddd, mmm dS, yy, h:MM TT"
                )}
              </text>
            </div>
            <hr className="headerUnderline"></hr>
            <div className="editorBox">
              <EditorFoyer
                user={user}
                note={activeNote}
                updateDB={debouncedOnUpdateNoteDB}
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NotePage;
