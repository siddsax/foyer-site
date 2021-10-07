import { useEffect, useState, useCallback, useRef } from "react";
import uuid from "react-uuid";
import ActiveNote from "../../Components/activeNote/ActiveNote";
import Sidebar from "../../Components/sidebar/Sidebar";
import Header from "../../Components/header/header";
import NotesList from "../../Components/NotesList/NotesList";
import { listUpcomingEvents } from "../../Components/GCalendarAPI/APIHelpers";
import firebase from "../../firebase";
// import debounce from "../../helpers";
import { debounce } from "debounce";
import "./NotesListPage.css";
import newNotes from "../../assets/images/newNotes.png";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import { formatMeeting } from "../../Components/Helpers/GeneralHelpers";

const NotesListPage = (props) => {
  const { user } = props;
  const db = firebase.firestore();
  var [notes, setNotes] = useState([]);
  const [meetings, setMeetings] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [sorted, setSorted] = useState(false);

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
      creator: user.uid,
      access: [user.email],
    };
    await db.collection("Notes").doc(`${uid}`).set(newNote);
    history.push(`/note-${uid}`);
  };

  const fetchNotes = () => {
    // **** here's the timeout ****
    const paginateNumber = 7;
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 300);

    const ref = db
      .collection("Notes")
      .where("access", "array-contains", user.email)
      .orderBy("createdAt", "desc");

    if (lastVisible.current === 0) {
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
    listUpcomingEvents(10, setMeetings);
    fetchNotes();
  }, []);

  useEffect(() => {
    const addMeetings = async () => {
      if (meetings && loading) {
        for (let i = 0; i < meetings.length; i++) {
          var done = 0;
          for (let j = 0; j < notes.length; j++) {
            if (notes[j].meetId === meetings[i].id) {
              done = 1;
            }
          }
          if (!done) {
            const meet = formatMeeting({ meetingCalendar: meetings[i] });
            await setNotes((prevValue) => [...prevValue, meet]);
          }
        }

        // await setNotes(notes.slice().sort((a, b) => a.createdAt - b.createdAt));
        await setNotes((prevValue) => {
          return prevValue.slice().sort((a, b) => a.createdAt - b.createdAt);
        });

        setSorted(true);
      }
    };
    addMeetings();
  }, [meetings]);

  useEffect(() => {
    const setFirstMonthNote = async () => {
      for (let j = 0; j < notes.length; j++) {
        var d1, d2;
        if (j > 0) {
          d1 = new Date(notes[j].createdAt).getMonth();
          d2 = new Date(notes[j - 1].createdAt).getMonth();
        } else {
          d1 = 0;
          d2 = 1;
        }

        console.log(d1, d2, "_____________");
        if (d1 !== d2) {
          console.log(d1, d2, "_______+++______");
          // notes[j].firstOfMonth = true;
          await setNotes((prevValue) => {
            prevValue[j].firstOfMonth = true;
            return prevValue;
          });
        }
      }
      setLoading(false);
    };

    if (sorted) {
      console.log(sorted);
      setFirstMonthNote();
    }
  }, [sorted]);

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
          <NotesList notes={notes} loading={loading} />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default NotesListPage;
