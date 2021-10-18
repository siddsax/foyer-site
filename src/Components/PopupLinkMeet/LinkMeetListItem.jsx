import { formatAMPM } from "..//NotesList/helper";
import "../Search/Search.css";
import "./PopupLinkMeet.css";
import firebase from "../../firebase";

var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const LinkMeetListItem = (props) => {
  const { note, setLinkNotes, close, activeNote, setUpdatingToggle } = props;
  const db = firebase.firestore();

  const selectNote = (title, content) => {
    console.log("Updating", note);
    setLinkNotes((preVal) => {
      if (!preVal) preVal = [];
      else
        var result = preVal.find((obj) => {
          return obj.id === note.id;
        });

      const toAdd = {
        id: note.id,
        createdAt: note.createdAt,
        end: note.end ? note.end : null,
        lastModified: note.lastModified,
        title: note.title,
        access: note.access,
        creator: note.creator,
      };

      if (!result) {
        var noteCopy = Object.assign({}, activeNote);
        delete noteCopy.body;
        delete noteCopy.linkNotes;

        db.collection("Notes")
          .doc(`${note.id}`)
          .update({
            linkNotes: firebase.firestore.FieldValue.arrayUnion(noteCopy),
          });
        setUpdatingToggle((preVal) => !preVal);

        return [...preVal, toAdd];
      } else return preVal;
    });
    close();
  };

  return (
    // <button>
    <div className="searchListItem" onClick={selectNote}>
      <div className="type">{note.meetId ? "Meeting Note" : "Note"}</div>
      <div className="title">| {note.title}</div>
      <div className="dateArea">
        {formatAMPM(new Date(note.createdAt))},{"  "}
        {weekdays[new Date(note.createdAt).getDay()]},{"  "}
        {new Date(note.createdAt).getDate()}/
        {new Date(note.createdAt).getMonth()}
      </div>
    </div>
    // </button>
  );
};

export default LinkMeetListItem;
