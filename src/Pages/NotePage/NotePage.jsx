import Header from "../../Components/header/header";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import { color, display, flexbox } from "@mui/system";
import "./NotePage.css";
import firebase from "../../firebase";
import dateFormat from "dateformat";
import EditorFoyer from "../../Components/Editor/Editor";
import { EditText } from "react-edit-text";
import { debounce } from "debounce";
import { listUpcomingEvents } from "../../Components/GCalendarAPI/APIHelpers";
import { useHistory } from "react-router-dom";
import { addMeetNote } from "../../Components/Helpers/BackendHelpers";
import { formatMeeting } from "../../Components/Helpers/GeneralHelpers";

const NotePage = (props) => {
  const { user, fromMeeting } = props;
  const location = useLocation();
  var activeNoteID = useRef(null);
  const [activeNote, setActiveNote] = useState(null);
  const [meetings, setMeetings] = useState(null);
  const history = useHistory();

  const db = firebase.firestore();

  const onUpdateNoteDB = (title, content) => {
    db.collection("Notes").doc(`${activeNoteID.current}`).update({
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

    var docRef = db.collection("Notes").doc(`${activeNoteID.current}`);

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

  const getMeetingNote = async (props) => {
    const { meetHangoutID } = props;
    var activeNote = "No Meeting";

    var docRef = db
      .collection("Notes")
      .where("hangoutLink", "==", `https://meet.google.com/${meetHangoutID}`);

    docRef
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log("Document exists", doc.data());
          activeNote = doc.data();
          activeNoteID.current = activeNote.id;
        });
        setActiveNote(activeNote);
      })
      .catch((error) => {
        console.log("Error getting document:", error);
        setActiveNote("No Meeting");
      });
  };

  useEffect(() => {
    if (!fromMeeting) {
      activeNoteID.current = location.pathname.split("note-")[1];
      getActiveNote();
    } else {
      getMeetingNote({
        meetHangoutID: location.pathname.split("meetid-")[1],
      });
    }
  }, []);

  useEffect(() => {
    if (activeNote === "No Meeting" && fromMeeting) {
      listUpcomingEvents(10, setMeetings);
    }
  }, [activeNote]);

  useEffect(() => {
    var found = 0;
    var uriHangoutID = location.pathname.split("meetid-")[1];
    if (meetings) {
      for (let i = 0; i < meetings.length; i++) {
        if (meetings[i].hangoutLink) {
          const meetHangoutID = meetings[i].hangoutLink.split("/").slice(-1)[0];
          if (meetHangoutID === uriHangoutID) {
            found = 1;
            var meet = formatMeeting({ meetingCalendar: meetings[i] });
            addMeetNote({
              meet: meet,
              db: db,
              history: history,
              user: user,
            }).then((note) => {
              activeNoteID.current = note.id;
              setActiveNote(note);
            });
            break;
          }
        }
      }
      if (!found) {
        history.push(`/`);
      }
    }
  }, [meetings]);

  const updateTitle = (value) => {
    onUpdateNoteDB(value, activeNote.body);
  };

  return (
    <div>
      <Header />
      {activeNote !== null && activeNote !== "No Meeting" ? (
        <div className="notePage">
          <div className="noteArea">
            <div className="noteHeaderArea">
              <div className="noteTitleArea">
                <EditText
                  className="noteTitle"
                  style={{
                    padding: "0px",
                    margin: "0px",
                    width: "100%",
                    "background-color": "#282828",
                    outline: "none",
                    "border-width": "0px",
                    // height: "40px",
                    overflow: "hidden",
                    // "text-overflow": "fade",
                  }}
                  onSave={(input) => {
                    updateTitle(input.value);
                  }}
                  defaultValue={activeNote.title}
                />
              </div>

              <div className="dateArea">
                <text className="date">
                  {dateFormat(
                    new Date(activeNote.createdAt),
                    "ddd, mmm d, h:MM TT"
                  )}
                </text>
              </div>
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
        <div>
          <text>Loading</text>
        </div>
      )}
    </div>
  );
};

export default NotePage;
