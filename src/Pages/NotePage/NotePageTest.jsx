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
import HashLoader from "react-spinners/HashLoader";
import PuffLoader from "react-spinners/PuffLoader";
import EditableText from "../../Components/EditableText/EditableText";
import PopupShare from "../../Components/PopupShare/PopupShare";
import { override } from "../../Components/Helpers/GeneralHelpers";
import PopupLinkMeet from "../../Components/PopupLinkMeet/PopupLinkMeet";
import NotesList from "../../Components/NotesList/NotesList";
import { setFirstMonthNote } from "../../Components/Helpers/GeneralHelpers";
import PopupActionItem from "../../Components/PopupActionItem/PopupActionItem";
import ActionItemsDisplay from "../../Components/ActionItemsDisplay/ActionItemsDisplay";
import alarmClock from "../../assets/icons/alarmClock.png";
import send from "../../assets/icons/send.png";
import plus from "../../assets/icons/plus.png";

let keysDown = {};

window.onkeyup = function (e) {
  keysDown[e.key] = false;
};

const NotePage = (props) => {
  const { user, fromMeeting } = props;
  const location = useLocation();
  var activeNoteID = useRef(null);
  const [activeNote, setActiveNote] = useState(null);
  const [meetings, setMeetings] = useState(null);
  const [contentState, setContentState] = useState(null);
  const [rerenderActionItems, setRerenderActionItems] = useState(false);
  const history = useHistory();
  const db = firebase.firestore();

  const [value, setValue] = useState("");
  const [linkNotes, setLinkNotes] = useState(null);
  const [loadingLinkNotes, setLoadingLinkNotes] = useState(true);
  const [updatingToggle, setUpdatingToggle] = useState(true);
  const [openActionItemPopup, setOpenActionItemPopup] = useState(false);

  // Not using due to errors
  const setNote = async (props) => {
    const { note } = props;
    await setActiveNote(note);
    await setLinkNotes(note.linkNotes ? note.linkNotes : []);
    await setUpdatingToggle((preVal) => !preVal);
  };

  const onUpdateNoteDB = (title, content) => {
    setContentState(
      document.getElementsByClassName("ql-container ql-snow")[0].childNodes[0]
        .innerHTML
    );

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

    docRef.get().then(async (doc) => {
      if (doc.exists) {
        console.log("Document exists", doc.data());
        activeNote = doc.data();
      } else {
        console.log("No such document!");
        activeNote = null;
      }
      await setActiveNote(activeNote);
      if (activeNote) {
        await setLinkNotes(activeNote.linkNotes ? activeNote.linkNotes : []);
        await setUpdatingToggle((preVal) => !preVal);
      }
    });
  };

  const getMeetingNote = async (props) => {
    const { meetHangoutID } = props;
    var activeNote = "No Meeting";
    var docRef;
    if (meetHangoutID.split("-").length > 1) {
      docRef = db
        .collection("Notes")
        .where("hangoutLink", "==", `https://meet.google.com/${meetHangoutID}`);
    } else {
      docRef = db.collection("Notes").where("meetId", "==", `${meetHangoutID}`);
    }

    docRef.get().then(async (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("Document exists", doc.data());
        activeNote = doc.data();
        activeNoteID.current = activeNote.id;
      });
      await setActiveNote(activeNote);
      await setLinkNotes(activeNote.linkNotes ? activeNote.linkNotes : []);
      await setUpdatingToggle((preVal) => !preVal);
    });
  };

  const updateTitle = (value) => {
    debouncedOnUpdateNoteDB(value, activeNote.body);
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
        document.getElementsByClassName("ql-container ql-snow")[0].childNodes[0]
          .innerHTML
      );
    }
  }, [value]);

  useEffect(() => {
    var found = 0;
    var meet;
    var uriHangoutID = location.pathname.split("meetid-")[1];
    if (meetings) {
      if (uriHangoutID.split("-").length > 1) {
        for (let i = 0; i < meetings.length; i++) {
          if (meetings[i].hangoutLink) {
            const meetHangoutID = meetings[i].hangoutLink
              .split("/")
              .slice(-1)[0];
            if (meetHangoutID === uriHangoutID) {
              found = 1; // meeting found, using this from the next 10 events
              meet = formatMeeting({ meetingCalendar: meetings[i] });
              break;
            }
          }
        }
      } else {
        found = 1; // meeting found by pulling directly via calendar api
        meet = formatMeeting({ meetingCalendar: meetings });
      }

      console.log(found, "~~~~~~~~~~~~~~~~~~~~~~~~~");

      if (found === 0) {
        meet = {
          hangoutLink: `https://meet.google.com${location.pathname}`,
          attendees: [{ 0: user.email }],
        };
      }

      console.log(meet, "===================@@@@@@@@@@@@@@@@@@");

      addMeetNote({
        meet: meet,
        db: db,
        history: history,
        user: user,
      }).then(async (note) => {
        activeNoteID.current = note.id;
        await setActiveNote(note);
        await setLinkNotes(note.linkNotes ? note.linkNotes : []);
        await setUpdatingToggle((preVal) => !preVal);
      });

      // if (!found) {
      //   history.push(`/`);
      // }
    }
  }, [meetings]);

  useEffect(() => {
    if (linkNotes) {
      const addDatesLinkNotes = async () => {
        await setLoadingLinkNotes(true);
        await db.collection("Notes").doc(`${activeNoteID.current}`).update({
          linkNotes: linkNotes,
        });

        await setLinkNotes((prevValue) => {
          return prevValue.slice().sort((a, b) => a.createdAt - b.createdAt);
        });

        await setFirstMonthNote({
          notes: linkNotes,
          setNotes: setLinkNotes,
          loadingTop: false,
          todayLine: false,
        });
        await setLoadingLinkNotes(false);
      };

      addDatesLinkNotes();
    }
  }, [updatingToggle]);

  return (
    <div>
      <Header activeNote={activeNote} />
      {activeNote !== null && activeNote !== "No Meeting" ? (
        <div className="notePage">
          <div className="notePageContent">
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
                  <div className="date">
                    {dateFormat(
                      new Date(activeNote.createdAt),
                      "ddd, mmm d, h:MM TT"
                    )}
                  </div>
                </div>
              </div>
              {/* <hr className="headerUnderline"></hr> */}
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
            <hr class="separateActionItems" />
            <div className="bottomArea">
              <div className="bottomAreaInner">
                <div className="buttonsArea">
                  <PopupShare
                    noteContent={contentState}
                    attendees={activeNote.access}
                    title={activeNote.title}
                    trigger={
                      <button className="shareNoteButtonNotePage">
                        <img src={send} />
                        <div style={{ "margin-left": "10px" }}>Send Notes</div>
                      </button>
                    }
                  />
                  <PopupActionItem
                    noteContent={contentState}
                    attendees={activeNote.access}
                    noteId={activeNote.id}
                    openActionItemPopup={openActionItemPopup}
                    setOpenActionItemPopup={setOpenActionItemPopup}
                    user={user}
                    setRerenderActionItems={setRerenderActionItems}
                    trigger={
                      <button className="actionItemButtonNotePage">
                        <img src={alarmClock} />

                        <div style={{ "margin-left": "10px" }}>
                          Assign Reminder
                        </div>
                      </button>
                    }
                  />
                </div>
                <div className="actionItemArea">
                  <ActionItemsDisplay
                    noteId={activeNote.id}
                    user={user}
                    rerenderActionItems={rerenderActionItems}
                  />
                </div>
                <div className="linkedMeetingsArea">
                  {loadingLinkNotes ? (
                    <PuffLoader
                      color="#049be4"
                      loading={loadingLinkNotes}
                      css={override}
                      size={50}
                    />
                  ) : (
                    <>
                      {linkNotes.length > 0 ? (
                        <>
                          <div className="linkedMeetingsHeader">
                            <div className="linkedMeetingsAreaTitle">
                              Related Meetings
                            </div>
                          </div>
                          <div className="linkedMeetingsListArea">
                            <div className="LinkedNotesListArea">
                              <NotesList notes={linkNotes} loading={false} />
                            </div>
                            <PopupLinkMeet
                              user={user}
                              setLinkNotes={setLinkNotes}
                              activeNote={activeNote}
                              setUpdatingToggle={setUpdatingToggle}
                              const
                              trigger={
                                <button className="linkedMeetingButton">
                                  <img src={plus} />
                                </button>
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="linkMeetsPromptArea">
                            <div className="linkMeetsPromptHead">
                              {" "}
                              Searching for older notes?
                            </div>
                            <PopupLinkMeet
                              user={user}
                              setLinkNotes={setLinkNotes}
                              activeNote={activeNote}
                              setUpdatingToggle={setUpdatingToggle}
                              const
                              trigger={
                                <div style={{ display: "flex" }}>
                                  <button className="addLinkMeets">
                                    <div>Find related Notes </div>
                                  </button>
                                  {"and link them to"}
                                </div>
                              }
                            />
                            <div
                              style={{
                                "text-align": "center",
                              }}
                            >
                              this meeting note so that they are always handing
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="loader">
          <HashLoader color="#049be4" loading={true} css={override} size={50} />
        </div>
      )}
    </div>
  );
};

export default NotePage;
