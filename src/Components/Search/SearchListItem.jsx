import "./Search.css";
import { formatAMPM } from "..//NotesList/helper";
import { Link } from "react-router-dom";

var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const SearchListItem = (props) => {
  const { note } = props;
  console.log(note, "+++++++++");
  return (
    <Link
      to={`/note-${note.id}`}
      // className="Note"
      style={{ textDecoration: "none" }}
    >
      <div className="searchListItem">
        <div className="type">{note.meetId ? "Meeting Note" : "Note"}</div>
        <div className="title">| {note.title}</div>
        <div className="dateArea">
          {formatAMPM(new Date(note.createdAt))},{"  "}
          {weekdays[new Date(note.createdAt).getDay()]},{"  "}
          {new Date(note.createdAt).getDate()}/
          {new Date(note.createdAt).getMonth()}
        </div>
      </div>
    </Link>
  );
};

export default SearchListItem;
