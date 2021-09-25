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

const NotesListPage = (props) => {
  const { user } = props;
  const db = firebase.firestore();
  const [notes, setNotes] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  var lastVisible = useRef(0);

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

  return (
    <div className="NotesListPage">
      <Header />
      <div className="NotesListArea">
        <NotesList notes={notes} />
      </div>
    </div>
  );
};

export default NotesListPage;
