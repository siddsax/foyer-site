import { useEffect, useState, useRef } from "react";
import uuid from "react-uuid";
import Header from "../../Components/header/header";
import NotesList from "../../Components/NotesList/NotesList";
import { listUpcomingEvents } from "../../Components/GCalendarAPI/APIHelpers";
import firebase from "../../firebase";
import "./NotesListPage.css";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import { formatMeeting } from "../../Components/Helpers/GeneralHelpers";
import PuffLoader from "react-spinners/PuffLoader";
import { css } from "@emotion/react";
import { setFirstMonthNote } from "../../Components/Helpers/GeneralHelpers";
import {
  override,
  handleScroll,
} from "../../Components/Helpers/GeneralHelpers";

const NotesListPage = (props) => {
  const { user } = props;
  const db = firebase.firestore();
  var [notes, setNotes] = useState([]);
  const [meetings, setMeetings] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [showNotes, setShowNotes] = useState(true);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [loadingTop, setLoadingTop] = useState(false);
  const [sorted, setSorted] = useState(false);
  const container = document.querySelector(".NotesListArea");
  var lastVisible = useRef(0);
  var scrollHeightOld = useRef(0);
  const paginateNumber = 7;

  const fillNotes = (querySnapshot) => {
    querySnapshot.forEach(async (doc) => {
      await setNotes((oldArray) => [doc.data(), ...oldArray]);
    });
    lastVisible.current = querySnapshot.docs[querySnapshot.docs.length - 1];
    if (lastVisible.current == null) {
      // Add some kind of rebound effect!!!!
      setLoadingTop(false);
    }
  };

  const addNote = async () => {
    const uid = uuid();
    const newNote = {
      id: uid,
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
      createdAt: Date.now(),
      creator: user.uid,
      access: [user.email],
      linkedNotes: [],
    };
    await db.collection("Notes").doc(`${uid}`).set(newNote);
    history.push(`/note-${uid}`);
  };

  const fetchNotes = async () => {
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
      setLoadingTop(false);
    }
  };

  const setScrolling = (offset) => {
    container.addEventListener("scroll", () =>
      handleScroll({
        actionTop: () => {
          if (loadingTop == false) {
            setLoadingTop(true);
            fetchNotes();
          }
        },
        actionBottom: () => {},
        container: container,
        scrollHeightOld: scrollHeightOld,
      })
    );
    if (!loadingTop) {
      window.setTimeout(() => {
        container.scrollTop = offset;
      }, 0);
    } else {
      window.setTimeout(() => {
        container.scrollTop = container.scrollHeight - scrollHeightOld.current;
      }, 0);
    }
    setLoading(false);
    setLoadingTop(false);
  };

  useEffect(() => {
    var newDateObj = new Date(new Date().getTime() - 1 * 60 * 60 * 1000);
    listUpcomingEvents(30, setMeetings, newDateObj);
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
        await setNotes((prevValue) => {
          return prevValue.slice().sort((a, b) => a.createdAt - b.createdAt);
        });

        setSorted(true);
      }
    };
    addMeetings();
  }, [meetings]);

  useEffect(() => {
    if (sorted) {
      setFirstMonthNote({
        notes: notes,
        setNotes: setNotes,
        loadingTop: loadingTop,
        todayLine: true,
      }).then((offset) => setScrolling(offset));
    }
  }, [sorted]);

  useEffect(() => {
    if (loadingTop) {
      setFirstMonthNote({
        notes: notes,
        setNotes: setNotes,
        loadingTop: loadingTop,
        todayLine: true,
      }).then((offset) => setScrolling(offset));
    }
  }, [notes]);

  return (
    <div className="NotesListPage">
      <div className="newNote">
        <Button
          variant="contained"
          onClick={addNote}
          style={{
            width: "200px",
            backgroundColor: getComputedStyle(
              document.documentElement
            ).getPropertyValue("--button-color"),
            color: "Black",
          }}
        >
          New Note
        </Button>
      </div>
      <div className="NotesListArea">
        {loadingTop ? (
          <>
            <PuffLoader
              color={"#049be4"}
              loading={loadingTop}
              css={override}
              size={50}
            />
          </>
        ) : (
          <></>
        )}
        <NotesList notes={notes} loading={loading} />
      </div>
    </div>
  );
};

export default NotesListPage;
