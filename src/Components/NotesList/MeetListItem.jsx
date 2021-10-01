import calender from "../../assets/images/calendar.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./NotesList.css";
import { formatAMPM } from "./helper";
import { useAuthState } from "react-firebase-hooks/auth";
import uuid from "react-uuid";
import { useHistory } from "react-router-dom";
import firebase from "../../firebase";

const MeetListItem = (props) => {
  const { meet } = props;
  const [user, loading, error] = useAuthState(firebase.auth());
  const history = useHistory();
  const db = firebase.firestore();

  const addMeetNote = async () => {
    const uid = uuid();

    const attendeesEmails = [];

    for (let i = 0; i < meet.attendees.length; i++) {
      attendeesEmails.push(meet.attendees[i].email);
    }

    const newNote = {
      id: uid,
      title: meet.title,
      body: '[{"type":"paragraph","children":[{"text":""}]}]',
      lastModified: Date.now(),
      createdAt:
        typeof meet.createdAt === "undefined" ? Date.now() : meet.createdAt,
      hangoutLink:
        typeof meet.hangoutLink === "undefined" ? null : meet.hangoutLink,
      meetId: meet.id,
      attendees: meet.attendees,
      end: meet.end,
      creator: user.uid,
      access: attendeesEmails,
    };
    console.log(newNote, "++++");
    await db.collection("Notes").doc(`${uid}`).set(newNote);
    history.push(`/note-${uid}`);
    // const handleOnClick = useCallback(() => history.push(`/note-${uid}`), [history]);
  };

  return (
    <div className="NoteItemArea">
      <div className="DateArea">
        <div className="Calendar">
          <div class="calendarDate">
            <em>Sat</em>
            <strong>
              {new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                new Date(meet.createdAt)
              )}
            </strong>
            <span>{new Date(meet.createdAt).getDate()}</span>
          </div>
        </div>
        <div className="DateTimeArea">
          <text className="DateTime">
            {formatAMPM(new Date(meet.createdAt))}
          </text>
        </div>
      </div>

      <div className="NoteArea">
        <button onClick={addMeetNote} className="buttonMeetingNote">
          <div>
            <text className="NoteTitle">{meet.title}</text>
          </div>
        </button>
        {/* </Link> */}
      </div>
    </div>
  );
};

export default MeetListItem;
