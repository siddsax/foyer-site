import calender from "../../assets/images/calendar.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./NotesList.css";
import { formatAMPM } from "./helper";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory } from "react-router-dom";
import firebase from "../../firebase";
import { addMeetNote } from "../Helpers/BackendHelpers";

var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const MeetListItem = (props) => {
  const { meet } = props;
  const [user, loading, error] = useAuthState(firebase.auth());
  const history = useHistory();
  const db = firebase.firestore();

  return (
    <div className="NoteItemArea">
      <div class="calendarDateArea">
        <text className="calendarDay">
          {weekdays[new Date(meet.createdAt).getDay()]}
        </text>
        <text className="calendarDate">
          {new Date(meet.createdAt).getDate()}
        </text>
      </div>

      <div className="NoteArea">
        <button
          onClick={() => {
            addMeetNote({ meet: meet, db: db, history: history, user: user });
          }}
          className="buttonMeetingNote"
        >
          <div className="NoteTitleArea">
            <text className="NoteTitleText">{meet.title}</text>
          </div>
          <div className="DateTimeArea">
            {meet.end ? (
              <text className="DateTime">
                {formatAMPM(new Date(meet.createdAt))} {" - "}
                {formatAMPM(new Date(meet.end))}
              </text>
            ) : null}
          </div>
        </button>
      </div>
    </div>
  );
};

export default MeetListItem;
