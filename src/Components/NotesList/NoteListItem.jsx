import calender from "../../assets/images/calendar.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "./NotesList.css";
import { weekdays, ListItemBarComponent } from "../Helpers/GeneralHelpers";
import trash from "../../assets/icons/trash.svg";
import firebase from "../../firebase";

const NoteListItem = (props) => {
  const { note } = props;
  const db = firebase.firestore();
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

  const onClickDelete = async () => {
    console.log("clicked");
    await db
      .collection("Notes")
      .doc(note.id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };
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
        <ListItemBarComponent
          item={note}
          to={`/note-${note.id}`}
          className="Note"
          onClick={pageReload}
          deleteIcon={trash}
          onClickDelete={onClickDelete}
        />
      </div>
    </div>
  );
};

export default NoteListItem;
