import calender from "../../assets/images/calendar.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./NotesList.css";
import { formatAMPM } from "./helper";

const NoteListItem = (props) => {
  const { note } = props;
  return (
    <div className="NoteItemArea">
      <div className="DateArea">
        <div className="Calendar">
          <div class="calendarDate">
            <em>Sat</em>
            <strong>
              {new Intl.DateTimeFormat("en-US", { month: "short" }).format(
                new Date(note.createdAt)
              )}
            </strong>
            <span>{new Date(note.createdAt).getDate()}</span>
          </div>
        </div>
        <div className="DateTimeArea">
          <text className="DateTime">
            {formatAMPM(new Date(note.createdAt))}
          </text>
        </div>
      </div>

      <div className="NoteArea">
        <Link
          to={`/note-${note.id}`}
          className="Note"
          style={{ textDecoration: "none" }}
        >
          <div className="NoteTitleArea">
            <text>{note.title}</text>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NoteListItem;
