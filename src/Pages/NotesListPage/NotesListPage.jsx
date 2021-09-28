import { useEffect, useState, useCallback, useRef } from "react";
import uuid from "react-uuid";
import ActiveNote from "../../Components/activeNote/ActiveNote";
import Sidebar from "../../Components/sidebar/Sidebar";
import Header from "../../Components/header/header";
import NotesList from "../../Components/NotesList/NotesList";

import firebase from "../../firebase";
// import debounce from "../../helpers";
import { debounce } from "debounce";
import "./NotesListPage.css";
import newNotes from "../../assets/images/newNotes.png";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";

const NotesListPage = (props) => {
  const { user } = props;
  const db = firebase.firestore();
  const [notes, setNotes] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const history = useHistory();

  var lastVisible = useRef(0);

  const fillNotes = (querySnapshot) => {
    querySnapshot.forEach(async (doc) => {
      await setNotes((oldArray) => [...oldArray, doc.data()]);
    });
    lastVisible.current = querySnapshot.docs[querySnapshot.docs.length - 1];
  };

  const addNote = async () => {
    const uid = uuid();
    const newNote = {
      id: uid,
      title: "Untitled Note",
      body: '[{"type":"paragraph","children":[{"text":""}]}]',
      lastModified: Date.now(),
      createdAt: Date.now(),
    };
    await db
      .collection("Users")
      .doc(`${user.uid}`)
      .collection("Notes")
      .doc(`${uid}`)
      .set(newNote);
    history.push(`/note-${uid}`);
    // const handleOnClick = useCallback(() => history.push(`/note-${uid}`), [history]);
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

  return (
    <div className="NotesListPage">
      <Header />
      <div className="modeSelectorArea">
        <div className="buttonArea">
          <label class="switch">
            <input
              type="checkbox"
              id="togBtn"
              onChange={() => {
                setShowNotes((prevValue) => !prevValue);
              }}
            />
            <div class="slider round">
              <span class="on">Notes</span>
              <span class="off">Action Items</span>
            </div>
          </label>

          <div className="newNote">
            <Button
              variant="contained"
              onClick={addNote}
              style={{ backgroundColor: "#EEBC1D", color: "Black" }}
            >
              New Note
            </Button>
          </div>
        </div>
      </div>
      {showNotes ? (
        <div className="NotesListArea">
          <NotesList notes={notes} />
        </div>
      ) : (
        <div>asasas</div>
      )}
    </div>
  );
};

export default NotesListPage;
