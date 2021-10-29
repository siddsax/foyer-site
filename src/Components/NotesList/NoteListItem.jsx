import calender from "../../assets/images/calendar.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./NotesList.css";
import { formatAMPM } from "./helper";
import { weekdays } from "../Helpers/GeneralHelpers";

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
            <text className="calendarDay">
              {weekdays[new Date(note.createdAt).getDay()]}
            </text>
            <text className="calendarDate">
              {new Date(note.createdAt).getDate()}
            </text>
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
