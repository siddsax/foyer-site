import calender from "../../assets/images/calendar.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./NotesList.css";
import { formatAMPM } from "./helper";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import firebase from "../../firebase";
import { addMeetNote } from "../Helpers/BackendHelpers";

const MeetListItem = (props) => {
  const { meet } = props;
  const [user, loading, error] = useAuthState(firebase.auth());
  const history = useHistory();
  const db = firebase.firestore();

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
            {meet.noTime ? null : formatAMPM(new Date(meet.createdAt))}
          </text>
        </div>
      </div>

      <div className="NoteArea">
        <button
          onClick={() => {
            addMeetNote({ meet: meet, db: db, history: history, user: user });
          }}
          className="buttonMeetingNote"
        >
          <div className="NoteTitleArea">
            <text>{meet.title}</text>
          </div>
        </button>
        {/* </Link> */}
      </div>
    </div>
  );
};

export default MeetListItem;
