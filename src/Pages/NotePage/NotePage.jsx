import Header from "../../Components/header/header";
import { useState, useEffect, useCallback, useRef } from "react";
import { color, display, flexbox } from "@mui/system";
import "./NotePage.css";
import firebase from "../../firebase";
import dateFormat from "dateformat";
import EditorFoyer from "../../Components/Editor/Editor";
import { debounce } from "debounce";
import {
  listUpcomingEvents,
  getMeetDetails,
} from "../../Components/GCalendarAPI/APIHelpers";
import { useHistory, useLocation } from "react-router-dom";
import { addMeetNote } from "../../Components/Helpers/BackendHelpers";
import { formatMeeting } from "../../Components/Helpers/GeneralHelpers";
import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
import EditableText from "./EditableText";
import PopupShare from "./shareAlert";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const NotePage = (props) => {
  const { user, fromMeeting } = props;
  const location = useLocation();
  var activeNoteID = useRef(null);
  const [activeNote, setActiveNote] = useState(null);
  const [meetings, setMeetings] = useState(null);
  const [contentState, setContentState] = useState(null);
  const history = useHistory();
  let [color, setColor] = useState("#049be4");
  const db = firebase.firestore();
  const [value, setValue] = useState(initialValue);

  const onUpdateNoteDB = (title, content) => {
    setContentState(
      document.getElementsByClassName("editorBox")[0].childNodes[2].innerHTML
    );

    console.log("Updating");
    db.collection("Notes").doc(`${activeNoteID.current}`).update({
      title: title,
      body: content,
      lastModified: Date.now(),
    });
  };

  const debouncedOnUpdateNoteDB = useCallback(
    debounce(onUpdateNoteDB, 500),
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
    var uriHangoutID = location.pathname.split("meetid-")[1];
    if (activeNote === "No Meeting" && fromMeeting) {
      if (uriHangoutID.split("-").length > 1) {
        listUpcomingEvents(10, setMeetings);
      } else {
        getMeetDetails({ eventId: uriHangoutID, setEvent: setMeetings });
      }
    }
  }, [activeNote]);

  useEffect(() => {
    if (activeNote !== null && activeNote !== "No Meeting") {
      setContentState(
        document.getElementsByClassName("editorBox")[0].childNodes[2].innerHTML
      );
    }
  }, [value]);

  useEffect(() => {
    var found = 0;
    var uriHangoutID = location.pathname.split("meetid-")[1];
    if (meetings) {
      if (uriHangoutID.split("-").length > 1) {
        for (let i = 0; i < meetings.length; i++) {
          if (meetings[i].hangoutLink) {
            const meetHangoutID = meetings[i].hangoutLink
              .split("/")
              .slice(-1)[0];
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
      } else {
        found = 1;
        var meet = formatMeeting({ meetingCalendar: meetings });
        addMeetNote({
          meet: meet,
          db: db,
          history: history,
          user: user,
        }).then((note) => {
          activeNoteID.current = note.id;
          setActiveNote(note);
        });
      }
      if (!found) {
        history.push(`/`);
      }
    }
  }, [meetings]);

  const updateTitle = (value) => {
    debouncedOnUpdateNoteDB(value, activeNote.body);
  };

  return (
    <div>
      <Header />
      {activeNote !== null && activeNote !== "No Meeting" ? (
        <div className="notePage">
          <div className="noteArea">
            <div className="noteHeaderArea">
              <div className="noteTitleArea">
                <EditableText
                  value={activeNote.title}
                  editClassName="inputTitle"
                  updateTitle={updateTitle}
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
                value={value}
                setValue={setValue}
              />
            </div>
          </div>
          <div className="shareNoteButtonArea">
            <PopupShare
              noteContent={contentState}
              attendees={activeNote.access}
              title={activeNote.title}
            />
          </div>
        </div>
      ) : (
        <div className="loader">
          <HashLoader color={color} loading={true} css={override} size={50} />
        </div>
      )}
    </div>
  );
};

export default NotePage;

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "This is editable " }],
  },
];
