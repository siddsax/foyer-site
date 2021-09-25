import calender from "../../assets/images/calendar.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./NotesList.css";

function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const NoteListItem = (props) => {
  const { note } = props;
  console.log(note, "----------------");
  return (
    <div className="NoteItemArea">
      <div className="DateArea">
        <div className="Calendar">
          <img src={calender} />
          <text className="monthName">
            {new Intl.DateTimeFormat("en-US", { month: "short" }).format(
              new Date(note.createdAt)
            )}
          </text>
          <text className="dateName">{new Date(note.createdAt).getDate()}</text>
        </div>

        <text className="DateTime">{formatAMPM(new Date(note.createdAt))}</text>
      </div>
      <div className="NoteArea">
        {/* <Link to={`/${note.id}`}> */}
        <Link
          to={`/note-${note.id}`}
          className="Note"
          style={{ textDecoration: "none" }}
        >
          <div>
            <text className="NoteTitle">{note.title}</text>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NoteListItem;
