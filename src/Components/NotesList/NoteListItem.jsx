import calender from "../../assets/images/calendar.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./NotesList.css";
import { weekdays, ListItemBarComponent } from "../Helpers/GeneralHelpers";

const NoteListItem = (props) => {
  const { note } = props;
  const pageReload = () => {
    console.log(window.location.href.split("/"));
    if (window.location.href.split("/").at(-1).split("-")[0] === "note") {
      console.log("Refreshed!!!");
      setTimeout(() => window.location.reload(), 10);
    }
  };
  var calendarDateAreaClass;
  if (note) {
    if (note.todayStart == 1) {
      calendarDateAreaClass = "calendarDateAreaB";
    } else {
      calendarDateAreaClass = "calendarDateArea";
    }
  }
  return (
    <div className="NoteItemArea">
      <div class={calendarDateAreaClass}>
        {note.firstOfDay ? (
          <>
            <div className="calendarDay">
              {weekdays[new Date(note.createdAt).getDay()]}
            </div>
            <div className="calendarDate">
              {new Date(note.createdAt).getDate()}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      <div className="NoteArea">
        <Link
          to={`/note-${note.id}`}
          className="Note"
          style={{ textDecoration: "none" }}
          onClick={pageReload}
        >
          <ListItemBarComponent item={note} />
        </Link>
      </div>
    </div>
  );
};

export default NoteListItem;
