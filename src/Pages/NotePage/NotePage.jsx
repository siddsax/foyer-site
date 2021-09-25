import Header from "../../Components/header/header";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { display, flexbox } from "@mui/system";
import "./NotePage.css";
import firebase from "../../firebase";

const NotePage = (props) => {
  const { user } = props;
  const location = useLocation();
  const activeNoteID = location.pathname.split("note-")[1];
  const [activeNote, setActiveNote] = useState(null);

  const db = firebase.firestore();

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

  return (
    <div>
      <Header />
      {activeNote ? (
        <div className="notePage">
          <div className="noteArea">
            {/* <div className="noteHeader">
              <text className="noteTitle">{activeNote.title}</text>
            </div> */}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default NotePage;
