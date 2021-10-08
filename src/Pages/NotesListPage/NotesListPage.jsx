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

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

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
  var offsetForToday = useRef(null);

  var offsetNoteArea = 60;
  var offsetMonthArea = 50;

  const handleScroll = () => {
    let triggerHeight = container.scrollTop + container.offsetHeight;
    if (triggerHeight >= container.scrollHeight) {
      console.log("Bottom");
    }
    if (container.scrollTop == 0) {
      setLoadingTop(true);
      console.log("Top");
      fetchNotes();
    }
  };

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
      body: '[{"type":"paragraph","children":[{"text":""}]}]',
      lastModified: Date.now(),
      createdAt: Date.now(),
      creator: user.uid,
      access: [user.email],
    };
    await db.collection("Notes").doc(`${uid}`).set(newNote);
    history.push(`/note-${uid}`);
  };

  const fetchNotes = async () => {
    // **** here's the timeout ****
    const paginateNumber = 7;
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 300);

    const ref = db
      .collection("Notes")
      .where("access", "array-contains", user.email)
      .orderBy("createdAt", "desc");

    if (lastVisible.current === 0) {
      console.log("Start, ++");
      ref.limit(paginateNumber).get().then(fillNotes);
    } else if (lastVisible.current != null) {
      console.log("mid, ++");
      ref
        .startAfter(lastVisible.current)
        .limit(paginateNumber)
        .get()
        .then(fillNotes);
    } else {
      console.log("End, ++");
      console.log("At the end of things");
      setLoadingTop(false);
    }
    console.log("Out, ++");
  };

  const setFirstMonthNote = async () => {
    // 50, 60
    var indx = -1;
    var offset = 0;
    var match = 0;

    for (let j = 0; j < notes.length; j++) {
      var m1, m2, d1, d2;
      if (j > 0) {
        m1 = new Date(notes[j].createdAt).getMonth();
        m2 = new Date(notes[j - 1].createdAt).getMonth();
      } else {
        m1 = new Date(notes[j].createdAt).getMonth();
        m2 = m1 - 1;
      }

      if (m1 !== m2) {
        await setNotes((prevValue) => {
          prevValue[j].firstOfMonth = true;
          prevValue[j].firstOfDay = true;
          return prevValue;
        });
        offset += offsetMonthArea;
      } else {
        d1 = new Date(notes[j].createdAt).getDay();
        d2 = new Date(notes[j - 1].createdAt).getDay();
        if (d1 !== d2) {
          await setNotes((prevValue) => {
            prevValue[j].firstOfDay = true;
            return prevValue;
          });
        }
      }

      // For the purpose of reaching the correct scroll point
      var mt = new Date().getMonth();
      var dt = new Date().getDay();
      offset += offsetNoteArea;

      if (mt === m1 && dt === d1) {
        indx = j;
        match = 1;
        // await setNotes((prevValue) => {
        //   prevValue[j].todayStart = true;
        //   return prevValue;
        // });
        break;
      }

      if (mt < m1) {
        indx = j; // The chosen point is ahead
        break;
      }

      if (mt === m1 && dt < d1) {
        indx = j; // The chosen point is ahead
        break;
      }
    }

    offsetForToday.current = offset;

    // for (let k = 0; k < notes.length; k++) {

    // }
    container.addEventListener("scroll", handleScroll);
    console.log(offset, "This is the place where we start scrolling!!!");
    if (!loadingTop) {
      window.setTimeout(() => {
        container.scrollTop = offset;
        if (match) {
          container.childNodes[0].childNodes[0].childNodes[
            indx + 1
          ].childNodes[0].childNodes[0].style.fontWeight = 600;
          container.childNodes[0].childNodes[0].childNodes[
            indx + 1
          ].childNodes[0].childNodes[0].style.backgroundColor =
            "rgba(0, 0, 0, 0.16)";
        }

        var el = document.createElement("span");

        el.innerHTML = "<hr style='height:5px;' color='black'>";
        insertAfter(
          container.childNodes[0].childNodes[0].childNodes[indx + 1],
          el
        );
      }, 0);
    }
    setLoading(false);
    setLoadingTop(false);
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
    if (sorted) {
      console.log(sorted);
      setFirstMonthNote();
    }
  }, [sorted]);

  useEffect(() => {
    if (loadingTop) {
      setFirstMonthNote();
    }
  }, [notes]);

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
      ) : (
        <div></div> // For action items
      )}
    </div>
  );
};

export default NotesListPage;
