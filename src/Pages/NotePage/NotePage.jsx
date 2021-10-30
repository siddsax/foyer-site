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
  const history = useHistory();
  const db = firebase.firestore();

  const [value, setValue] = useState(initialValue);
  const [linkNotes, setLinkNotes] = useState(null);
  const [loadingLinkNotes, setLoadingLinkNotes] = useState(true);
  const [updatingToggle, setUpdatingToggle] = useState(true);
  const [openActionItemPopup, setOpenActionItemPopup] = useState(false);

  return (
    <div>
      {/* <Header activeNote={activeNote} /> */}
      <Header activeNote={null} />
      {/* {activeNote !== null && activeNote !== "No Meeting" ? ( */}
      <div className="notePage">
        <div className="notePageContent">
          <div className="noteArea">
            <div className="noteHeaderArea">
              <div className="noteTitleArea">
                <EditableText
                  value={"Dummy"}
                  editClassName="inputTitle"
                  // updateTitle={updateTitle}
                />
              </div>

              <div className="dateArea">
                <text className="date">
                  {/* {dateFormat(
                      new Date(activeNote.createdAt),
                      "ddd, mmm d, h:MM TT"
                    )} */}
                </text>
              </div>
            </div>
            <hr className="headerUnderline"></hr>
            <div className="editorBox">
              <EditorFoyer
                user={user}
                // note={activeNote}
                // updateDB={debouncedOnUpdateNoteDB}
                value={value}
                setValue={setValue}
              />
            </div>
            {/* <div className="actionItemArea">
                <ActionItemsDisplay noteId={activeNote.id} user={user} />
              </div> */}
          </div>
          <div className="shareNoteButtonArea">
            {/* <PopupShare
                noteContent={contentState}
                attendees={activeNote.access}
                title={activeNote.title}
              />
              <PopupActionItem
                noteContent={contentState}
                attendees={activeNote.access}
                noteId={activeNote.id}
                openActionItemPopup={openActionItemPopup}
                setOpenActionItemPopup={setOpenActionItemPopup}
                user={user}
              /> */}
          </div>
          <div className="linkedMeetingsArea">
            <div className="linkedMeetingsHeader">
              <div className="linkedMeetingsAreaTitle">Linked Meetings</div>
              <PopupLinkMeet
                user={user}
                setLinkNotes={setLinkNotes}
                // activeNote={activeNote}
                setUpdatingToggle={setUpdatingToggle}
              />
            </div>
            <div className="linkedMeetingsListArea">
              {!loadingLinkNotes ? (
                <div className="LinkedNotesListArea">
                  <NotesList notes={linkNotes} loading={false} />
                </div>
              ) : (
                <>
                  <PuffLoader
                    color="#049be4"
                    loading={loadingLinkNotes}
                    css={override}
                    size={50}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ) : (
        <div className="loader">
          <HashLoader color="#049be4" loading={true} css={override} size={50} />
        </div>
      )} */}
    </div>
  );
};

export default NotePage;

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];
