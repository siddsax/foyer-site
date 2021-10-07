import calender from "../../assets/images/calendar.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./NotesList.css";
import { formatAMPM } from "./helper";

var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// {formatAMPM(new Date(note.createdAt))}

const NoteListItem = (props) => {
  const { note } = props;
  return (
    <div className="NoteItemArea">
      <div class="calendarDateArea">
        <text className="calendarDay">
          {weekdays[new Date(note.createdAt).getDay()]}
        </text>
        <text className="calendarDate">
          {new Date(note.createdAt).getDate()}
        </text>
      </div>
      {/* <div className="DateTimeArea">
        <text className="DateTime">{formatAMPM(new Date(note.createdAt))}</text>
      </div> */}

      <div className="NoteArea">
        <Link
          to={`/note-${note.id}`}
          className="Note"
          style={{ textDecoration: "none" }}
        >
          <div className="NoteTitleArea">
            <text className="NoteTitleText">{note.title}</text>
          </div>
          <div className="DateTimeArea">
            {note.end ? (
              <text className="DateTime">
                {formatAMPM(new Date(note.createdAt))} {" - "}
                {formatAMPM(new Date(note.end))}
              </text>
            ) : null}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NoteListItem;
